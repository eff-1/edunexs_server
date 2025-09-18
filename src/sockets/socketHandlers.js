import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const connectedUsers = new Map()

export const setupSocketHandlers = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')
      
      if (!user) {
        return next(new Error('User not found'))
      }

      socket.userId = user._id.toString()
      socket.user = user
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.user.name} (${socket.userId})`)
    
    // Store connected user
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      joinedRooms: new Set()
    })

    // Emit updated online users list
    io.emit('onlineUsers', Array.from(connectedUsers.values()).map(u => ({
      _id: u.user._id,
      name: u.user.name,
      avatar: u.user.avatar
    })))

    // Join course room
    socket.on('joinCourse', (courseId) => {
      try {
        const roomName = `course_${courseId}`
        socket.join(roomName)
        
        // Track joined rooms
        const userConnection = connectedUsers.get(socket.userId)
        if (userConnection) {
          userConnection.joinedRooms.add(roomName)
        }

        console.log(`📚 User ${socket.user.name} joined course ${courseId}`)
        
        // Notify others in the room
        socket.to(roomName).emit('userJoinedCourse', {
          user: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          },
          courseId
        })
      } catch (error) {
        socket.emit('error', { message: 'Failed to join course room' })
      }
    })

    // Leave course room
    socket.on('leaveCourse', (courseId) => {
      try {
        const roomName = `course_${courseId}`
        socket.leave(roomName)
        
        // Remove from tracked rooms
        const userConnection = connectedUsers.get(socket.userId)
        if (userConnection) {
          userConnection.joinedRooms.delete(roomName)
        }

        console.log(`📚 User ${socket.user.name} left course ${courseId}`)
        
        // Notify others in the room
        socket.to(roomName).emit('userLeftCourse', {
          user: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          },
          courseId
        })
      } catch (error) {
        socket.emit('error', { message: 'Failed to leave course room' })
      }
    })

    // Send message to course room
    socket.on('sendMessage', (data) => {
      try {
        const { courseId, message, type = 'text' } = data
        const roomName = `course_${courseId}`
        
        const messageData = {
          _id: Date.now().toString(), // Temporary ID
          user: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          },
          message,
          type,
          courseId,
          createdAt: new Date(),
          isOwn: false
        }

        // Send to all users in the course room except sender
        socket.to(roomName).emit('newMessage', messageData)
        
        // Send back to sender with isOwn flag
        socket.emit('newMessage', { ...messageData, isOwn: true })
        
        console.log(`💬 Message sent in course ${courseId} by ${socket.user.name}`)
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Send typing indicator
    socket.on('typing', (data) => {
      const { courseId, isTyping } = data
      const roomName = `course_${courseId}`
      
      socket.to(roomName).emit('userTyping', {
        user: {
          _id: socket.user._id,
          name: socket.user.name
        },
        isTyping,
        courseId
      })
    })

    // Send notification to specific user
    socket.on('sendNotification', (data) => {
      try {
        const { targetUserId, notification } = data
        const targetUser = connectedUsers.get(targetUserId)
        
        if (targetUser) {
          io.to(targetUser.socketId).emit('notification', {
            ...notification,
            from: {
              _id: socket.user._id,
              name: socket.user.name,
              avatar: socket.user.avatar
            },
            createdAt: new Date()
          })
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send notification' })
      }
    })

    // Broadcast announcement (instructors/admins only)
    socket.on('sendAnnouncement', (data) => {
      try {
        if (!['instructor', 'admin'].includes(socket.user.role)) {
          return socket.emit('error', { message: 'Unauthorized to send announcements' })
        }

        const { courseId, announcement } = data
        const roomName = `course_${courseId}`
        
        const announcementData = {
          _id: Date.now().toString(),
          user: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar,
            role: socket.user.role
          },
          message: announcement,
          type: 'announcement',
          courseId,
          createdAt: new Date()
        }

        // Send to all users in the course room
        io.to(roomName).emit('newAnnouncement', announcementData)
        
        console.log(`📢 Announcement sent in course ${courseId} by ${socket.user.name}`)
      } catch (error) {
        socket.emit('error', { message: 'Failed to send announcement' })
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`👤 User disconnected: ${socket.user.name} (${socket.userId})`)
      
      // Remove from connected users
      connectedUsers.delete(socket.userId)
      
      // Emit updated online users list
      io.emit('onlineUsers', Array.from(connectedUsers.values()).map(u => ({
        _id: u.user._id,
        name: u.user.name,
        avatar: u.user.avatar
      })))
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })

  // Utility function to get online users count
  io.getOnlineUsersCount = () => connectedUsers.size
  
  // Utility function to get users in a course
  io.getUsersInCourse = (courseId) => {
    const roomName = `course_${courseId}`
    const room = io.sockets.adapter.rooms.get(roomName)
    return room ? room.size : 0
  }
}
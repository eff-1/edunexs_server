# 📱 WhatsApp Notification Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Get CallMeBot API Key

1. **Add CallMeBot to WhatsApp contacts**: `+34 644 59 71 67`
2. **Send this exact message**: `I allow callmebot to send me messages`
3. **Wait for reply** with your API key (example: `123456`)
4. **Copy the API key** number

### Step 2: Add API Key to Server

1. **Open your server's environment variables** (Render dashboard → Environment tab)
2. **Add this variable**:
   - **Key**: `CALLMEBOT_API_KEY`
   - **Value**: `your_actual_api_key` (the number you got from CallMeBot)
3. **Save and redeploy** your server

### Step 3: Test It

1. **Register a test tutor** on your website
2. **Check your WhatsApp** - you should get an automatic message!

## 🔧 Troubleshooting

### "No API key configured"
- Make sure you added `CALLMEBOT_API_KEY` to your environment variables
- Redeploy your server after adding the key

### "Message not received"
- Check if you sent the exact message: `I allow callmebot to send me messages`
- Make sure CallMeBot replied with an API key
- Try sending a test message to CallMeBot first

### "API Error"
- CallMeBot has daily limits (check their website)
- Try again in a few minutes
- Make sure your phone number is correct in the .env file

## 📋 Environment Variables Needed

```env
CALLMEBOT_API_KEY=123456
ADMIN_WHATSAPP_NUMBER=2348128653553
```

## 🎯 How It Works

1. **User registers as tutor** → Server gets registration
2. **Server calls CallMeBot API** → Sends message to your WhatsApp
3. **You get instant notification** → With all tutor details
4. **You contact tutor** → Using their preferred method

## 🚨 Important Notes

- **Free service**: CallMeBot is free but has daily limits
- **Message length**: Limited to 1000 characters (we handle this)
- **Reliability**: ~95% success rate (pretty good for free)
- **Backup**: Web interface still works if CallMeBot fails

## 🔄 Fallback Options

If CallMeBot doesn't work:
1. **Web interface**: Visit `/admin/notifications.html`
2. **Email notifications**: We can set this up too
3. **Telegram bot**: Alternative option

## 📞 Support

If you need help:
1. Check the server logs for error messages
2. Test CallMeBot manually first
3. Make sure environment variables are set correctly
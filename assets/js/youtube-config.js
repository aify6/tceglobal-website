/**
 * YouTube Live Stream Configuration
 * ════════════════════════════════════════════════════════════════
 * 
 * SETUP (OPTIONAL):
 * To automatically detect live streams:
 * 1. Get YouTube API Key: https://console.cloud.google.com/
 * 2. Enable "YouTube Data API v3"
 * 3. Replace 'YOUR_YOUTUBE_API_KEY_HERE' with your key
 * 
 * WITHOUT API KEY:
 * - Clicking "Watch Live" goes directly to the channel
 * 
 * WITH API KEY:
 * - If LIVE: Shows embedded livestream
 * - If NOT LIVE: Goes to channel
 * 
 */

window.YOUTUBE_CONFIG = {
  // Your YouTube API key (optional - site works without it)
  API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',

  // Watch Live links to Dr. Bukola Williams' channel intentionally; footer social links use the main church channel @thechangeembassy
  CHANNEL_HANDLE: '@Drwilliamsbukola'
};


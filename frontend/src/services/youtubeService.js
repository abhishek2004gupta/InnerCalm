const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchYouTubeVideos = async (suggestions) => {
  try {
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key not found');
      return [];
    }

    // Extract keywords from suggestions
    const keywords = suggestions
      .map(line => line.toLowerCase())
      .join(' ')
      .split(/[^a-z0-9]+/)
      .filter(word => word.length > 3)
      .slice(0, 5)
      .join(' ');

    // Search for videos with English content
    const searchResponse = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&q=${encodeURIComponent(keywords)}&type=video&maxResults=3&relevanceLanguage=en&regionCode=US&key=${YOUTUBE_API_KEY}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch YouTube videos');
    }

    const searchData = await searchResponse.json();

    // Get video details
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const videoResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video details');
    }

    const videoData = await videoResponse.json();

    // Combine search and video data
    return searchData.items.map((item, index) => {
      const duration = videoData.items[index]?.contentDetails.duration;
      return {
        video_id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail_url: item.snippet.thumbnails.high.url,
        video_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        duration: formatDuration(duration)
      };
    });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

const formatDuration = (duration) => {
  if (!duration) return '';
  
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  let result = '';
  if (hours) result += `${hours}:`;
  result += `${minutes.padStart(2, '0')}:`;
  result += seconds.padStart(2, '0');

  return result;
}; 
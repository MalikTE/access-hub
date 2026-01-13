export interface SiteInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const predefinedSites: SiteInfo[] = [
  { id: 'google', name: 'Google', icon: 'https://www.google.com/favicon.ico', color: '#4285F4' },
  { id: 'facebook', name: 'Facebook', icon: 'https://www.facebook.com/favicon.ico', color: '#1877F2' },
  { id: 'twitter', name: 'X (Twitter)', icon: 'https://abs.twimg.com/favicons/twitter.3.ico', color: '#000000' },
  { id: 'instagram', name: 'Instagram', icon: 'https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png', color: '#E4405F' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'https://static.licdn.com/aero-v1/sc/h/akt4ae504epesldzj74dzred8', color: '#0A66C2' },
  { id: 'github', name: 'GitHub', icon: 'https://github.githubassets.com/favicons/favicon.svg', color: '#181717' },
  { id: 'netflix', name: 'Netflix', icon: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico', color: '#E50914' },
  { id: 'spotify', name: 'Spotify', icon: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png', color: '#1DB954' },
  { id: 'amazon', name: 'Amazon', icon: 'https://www.amazon.com/favicon.ico', color: '#FF9900' },
  { id: 'apple', name: 'Apple', icon: 'https://www.apple.com/favicon.ico', color: '#A2AAAD' },
  { id: 'microsoft', name: 'Microsoft', icon: 'https://www.microsoft.com/favicon.ico', color: '#00A4EF' },
  { id: 'dropbox', name: 'Dropbox', icon: 'https://www.dropbox.com/static/30168/images/favicon.ico', color: '#0061FF' },
  { id: 'slack', name: 'Slack', icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png', color: '#4A154B' },
  { id: 'discord', name: 'Discord', icon: 'https://discord.com/assets/favicon.ico', color: '#5865F2' },
  { id: 'reddit', name: 'Reddit', icon: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png', color: '#FF4500' },
  { id: 'paypal', name: 'PayPal', icon: 'https://www.paypalobjects.com/webstatic/icon/pp32.png', color: '#00457C' },
];

export const getDefaultSite = (): SiteInfo => ({
  id: 'custom',
  name: 'Custom',
  icon: '',
  color: '#14B8A6',
});

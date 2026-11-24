import Config from 'react-native-config';

export const ENV = {
  environment: Config.ENVIRONMENT_NAME || 'dev',
  baseUrl: Config.BASE_URL || '',

}
import axios from 'axios';
import cherrio from "cheerio";

export const response = (code: number, status: string, result: any, message = '') => {
  return {
    code,
    status,
    result,
    message
  }
}

export const customError = (message: string, code: number) => {
  const error = new Error(message) as any;
  error.code = code;
  return error;
}

const generateUrlProfile = (username: string) => {
  let baseUrl = "https://www.tiktok.com/";
  if (username.includes("@")) {
      baseUrl = `${baseUrl}${username}`;
  } else {
      baseUrl = `${baseUrl}@${username}`;
  }
  return baseUrl;
};

const defaultToken = 'msToken=fQwvOykMyAlCfv9RYfZtgEjDh8PMhKSExoQwCbeXc3wg33uHM3pLA4S3cr2aJRg7VClvGuRBtHmGG6W59Dc-4tiYf56Szjy2WmPjJP87__Bdlh-gTuIX8n8l8w==; msToken=Pk_Z2zWOyEWtmsBfJ__1gmBgkrjb95EnRxks4gkxL5Sy4i65h1RhAkKJ7gHnhff-JbgkMJpaMBG_1WOsooffGiqgKO0iP6MSS53uVogqdGhfITROqK0zd-cUSQ==; passport_csrf_token=c00c3644bd819e797d77381f4df7625d; passport_csrf_token_default=c00c3644bd819e797d77381f4df7625d; csrf_session_id=a2f0d1eadfe42033f8db3a98547fac86; s_v_web_id=verify_lnfrx6ye_zFPXV7DG_VJ6d_44IV_8qzi_RzwrhCuURhAe; passport_fe_beating_status=true; __tea_cache_tokens_1988={%22_type_%22:%22default%22%2C%22user_unique_id%22:%227282356762959103490%22%2C%22timestamp%22:1695555841599}; tiktok_webapp_theme=light';

const getCookie = async () => {
  try {
    const cookie = await axios.get('https://pastebin.com/raw/ELJjcbZT');
    return cookie.data;
  } catch (error) {
    return null;
  }
};

export const checkExistUser = async (username: string) => {
  try {
    const cookie = await getCookie() || defaultToken;
    const url = generateUrlProfile(username);
    const headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
      'cookie': cookie,
    };
    const options = { headers };
    const load = await axios.get(url, options);
    // tslint:disable-next-line:no-unused-expression
    const $ = (0, cherrio.load)(load.data);
    const result = JSON.parse($("script#SIGI_STATE").text());
    if (!result || !result.UserModule) {
      return false;
    }
    return true;
  } catch(err) {
   return false;
  }
};


import express from 'express';
export const routes = express.Router();
import { TiktokDL, TiktokStalk } from '@tobyg74/tiktok-api-dl';
import { customError, response } from './utils/index.js';
import { status } from './constants/constants.js';
import { IResponseV2 } from './interface/index.js';
import dotenv from 'dotenv';
import ttdl from 'vz-tiktok-downloader';

dotenv.config();

routes.post('/getDataFromURL', async(req, res) => {
  try {
    const { body } = req;
    if (!body || !body.url) {
      throw customError('Bạn phải nhập vào một đường dẫn của video!!!', 400);
    }
    const responseData: IResponseV2 = await TiktokDL(body.url, {
      version: "v1"
    });
    if (!responseData || !responseData.result) {
      throw customError('Video không tồn tại hoặc đã bị xóa!!!', 404);
    }
    return res.status(200).send(response(200, status.success, responseData.result));
  } catch (err) {
    console.log(err);
    if (err.code !== 500) {
      return res.status(err.code).send(response(err.code, status.failed, null, err.message));
    }
    return res.status(500).send(response(500, status.failed, null, 'Server bị lỗi!!!'));
  }
});

routes.post('/getVideosFromUser', async (req, res) => {
  try {
    const { body } = req;

    if (!body || !body.username) {
      throw customError('Bạn phải nhập một username!!!', 400);
    }

    const options = {
      cookie: process.env.cookie || ''
    }
    const responseData = await TiktokStalk(body.username, options);
    if (!responseData || !responseData.result) {
      throw customError('Không tìm thấy người dùng này!!!', 404);
    }
    return res.status(200).send(response(200, status.success, responseData.result));
  } catch (err) {
    console.log(err);
    if (err.code !== 500) {
      return res.status(err.code).send(response(err.code, status.failed, null, err.message));
    }
    return res.status(500).send(response(500, status.failed, null, 'Server bị lỗi!!!'));
  }
});

routes.post('/download', async(req, res) => {
  try {
    const { body } = req;
    if (!body || !body.id || !body.username) {
      throw customError('Bạn phải nhập username và id của video!!!', 400);
    }
    const { username, id } = req.body;
    const url = `https://www.tiktok.com/${username}/video/${id}`
    const fetchVideo = await ttdl.getInfo(url);
    if (!fetchVideo.success || !fetchVideo.author || !fetchVideo.author.profile ) {
      throw customError('Lỗi không thể download video!!!', 404);
    }
    return res.status(200).send(response(200, status.success, fetchVideo.video));
  } catch (err) {
    console.log(err);
    if (err.code !== 500) {
      return res.status(err.code).send(response(err.code, status.failed, null, err.message));
    }
    return res.status(500).send(response(500, status.failed, null, 'Server bị lỗi!!!'));
  }
});

routes.post('/downloadAll', async(req, res) => {
  try {
    const { body } = req;
    if (!body || !body.idList || !body.username || !Array.isArray(body.idList)) {
      throw customError('Bạn phải nhập username và id list của video!!!', 400);
    }
    const responseList = [];
    const { username, idList} = req.body;
    for (const id of idList) {
      const url = `https://www.tiktok.com/${username}/video/${id}`
      const fetchVideo = await ttdl.getInfo(url);
      if (fetchVideo.success &&
        fetchVideo.author
        && fetchVideo.author.profile
        && fetchVideo.video.url && fetchVideo.video.url.no_wm
      ) {
        responseList.push({
          id,
          url: fetchVideo.video.url.no_wm
        });
      }
    }
    return res.status(200).send(response(200, status.success, responseList));
  } catch (err) {
    console.log(err);
    if (err.code !== 500) {
      return res.status(err.code).send(response(err.code, status.failed, null, err.message));
    }
    return res.status(500).send(response(500, status.failed, null, 'Server bị lỗi!!!'));
  }
});
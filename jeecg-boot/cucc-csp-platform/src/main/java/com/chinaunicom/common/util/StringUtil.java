package com.chinaunicom.common.util;

import org.jeecg.common.util.DateUtils;

import java.util.Date;
import java.util.Random;

/**
  * @description
  *
  * @author 木头人
  * @date 2021/6/3 16:41
  * @version 1.0
  */
public class StringUtil {

    public static final String RANDOM_SED = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    /**
     * 生成随机流水号
     * yyyyMMddHHmmss+8位随机字符
     *
     * @return
     */
    public static String generateNonce(int randomSize) {
        String dateTime = DateUtils.yyyymmddhhmmss.get().format(new Date());
        char[] chars = new char[randomSize];
        Random r = new Random();
        for (int i = 0; i < chars.length; i++) {
            chars[i] = RANDOM_SED.charAt(r.nextInt(RANDOM_SED.length()));
        }
        return dateTime + new String(chars);
    }
}

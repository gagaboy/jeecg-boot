package com.chinaunicom.business.chatbot.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
  * @description chatbot账号精简数据，可用于接口返回部分字段使用
  *
  * @author 木头人
  * @date 2021/6/23 17:18
  * @version 1.0
  */
@Data
public class ChatbotAccountSimpleVO {

    @ApiModelProperty(value = "ID")
    private String chatbotId;

    @ApiModelProperty(value = "chatbot名称")
    private String chatbotName;

    @ApiModelProperty(value = "所属运营商")
    private String operator;
}

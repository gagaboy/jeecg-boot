package com.chinaunicom.business.chatbot.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
  * @description
  *
  * @author 木头人
  * @date 2021/6/25 14:51
  * @version 1.0
  */
@ApiModel(value = "ChatbotAccountCopyVO", description = "Chatbot账号复制VO")
@Data
public class ChatbotAccountCopyVO {

    @NotBlank(message = "chatbotId不能为空")
    @ApiModelProperty(value = "Chatbot账号ID")
    private String chatbotId;

    @NotBlank(message = "chatbot名称不能为空")
    @ApiModelProperty(value = "Chatbot账号名称")
    private String chatbotName;

    @NotBlank(message = "未选择服务daq")
    @ApiModelProperty(value = "服务大区ID")
    private String serviceRegionId;

    @NotBlank(message = "未选择省份")
    @ApiModelProperty(value = "省份")
    private String province;

    @NotBlank(message = "未选择城市")
    @ApiModelProperty(value = "城市")
    private String city;

    @ApiModelProperty(value = "详细地址")
    private String address;
}

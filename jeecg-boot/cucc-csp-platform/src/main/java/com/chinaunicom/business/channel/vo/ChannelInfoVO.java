package com.chinaunicom.business.channel.vo;

import com.chinaunicom.business.chatbot.vo.ChatbotAccountSimpleVO;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountVO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Date;
import java.util.List;

/**
  * @description
  *
  * @author 木头人
  * @date 2021/6/23 15:17
  * @version 1.0
  */
@Data
public class ChannelInfoVO {

    @ApiModelProperty(value = "ID")
    private String channelId;

    @NotBlank(message = "通道名称不能为空")
    @ApiModelProperty(value = "通道名称")
    private String channelName;

    @NotBlank(message = "未选择通道类型")
    @ApiModelProperty(value = "通道类型（数据来源字典表）")
    private String channelType;

    @ApiModelProperty(value = "通道类型名称")
    private String channelTypeName;

    @ApiModelProperty(value = "状态（0：正常，-1：删除）")
    private Integer status;

    @ApiModelProperty(value = "所属企业")
    private String entId;

    @ApiModelProperty(value = "企业logo地址")
    private String entLogoUrl;

    @ApiModelProperty(value = "企业名称")
    private String entName;

    @NotEmpty(message = "未选择管理账号")
    @ApiModelProperty(value = "关联账号")
    private List<ChatbotAccountSimpleVO> chatbotAccountList;

    @ApiModelProperty(value = "创建人")
    private String createBy;

    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "编辑人")
    private String updateBy;

    @ApiModelProperty(value = "修改时间")
    private Date updateTime;
}

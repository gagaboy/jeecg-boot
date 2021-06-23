package com.chinaunicom.business.chatbot.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * chatbot账号信息
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
@Data
@ApiModel(value = "ChatbotAccountVO", description = "ChatbotAccountVO")
public class ChatbotAccountVO {


    @ApiModelProperty(value = "ID")
    private String chatbotId;

    @ApiModelProperty(value = "chatbot名称")
    private String chatbotName;

    @ApiModelProperty(value = "chatbot logo url")
    private String logoUrl;

    @ApiModelProperty(value = "短信端口号")
    private String smsNum;

    @ApiModelProperty(value = "签名")
    private String sign;

    @ApiModelProperty(value = "服务大区ID")
    private String serviceRegionId;

    @ApiModelProperty(value = "chatbot账号域名")
    private String chatbotDomain;

    @ApiModelProperty(value = "省份")
    private String province;

    @ApiModelProperty(value = "城市")
    private String city;

    @ApiModelProperty(value = "详细地址")
    private String addres;

    @ApiModelProperty(value = "行业分类")
    private String industry;

    @ApiModelProperty(value = "服务描述")
    private String serviceDesc;

    @ApiModelProperty(value = "服务提供商")
    private String serviceProvider;

    @ApiModelProperty(value = "服务提供商是否显示")
    private Boolean providerShowEnabled;

    @ApiModelProperty(value = "电子邮箱")
    private String email;

    @ApiModelProperty(value = "官网")
    private String officialWebsite;

    @ApiModelProperty(value = "电话")
    private String phone;

    @ApiModelProperty(value = "所属企业")
    private String entId;

    @ApiModelProperty(value = "审核状态（0：未审核，1：审核中，2：审核通过，-1：审核不通过）")
    private Integer auditStatus;

    @ApiModelProperty(value = "状态（0：启用，1：停用）")
    private Integer status;

    @ApiModelProperty(value = "通道ID")
    private String channelId;

    @ApiModelProperty(value = "通道名称")
    private String channelName;

    @ApiModelProperty(value = "创建人")
    private String createBy;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "编辑人")
    private String updateBy;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "修改时间")
    private Date updateTime;

}

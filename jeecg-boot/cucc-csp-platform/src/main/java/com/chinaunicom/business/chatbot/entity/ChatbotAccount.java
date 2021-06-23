package com.chinaunicom.business.chatbot.entity;

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
import javax.validation.constraints.NotNull;
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
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("chatbot_account")
@ApiModel(value = "ChatbotAccount对象", description = "chatbot账号信息")
public class ChatbotAccount extends Model<ChatbotAccount> {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "ID")
    @TableId(value = "chatbot_id", type = IdType.ASSIGN_ID)
    private String chatbotId;

    @NotBlank(message = "chatbot名称不能为空")
    @ApiModelProperty(value = "chatbot名称")
    private String chatbotName;

    @NotBlank(message = "未上传chatbot logo图片")
    @ApiModelProperty(value = "chatbot logo url")
    private String logoUrl;

    @NotBlank(message = "短信端口号不能为空")
    @ApiModelProperty(value = "短信端口号")
    private String smsNum;

    @NotBlank(message = "签名不能为空")
    @ApiModelProperty(value = "签名")
    private String sign;

    @NotBlank(message = "未选择服务大区")
    @ApiModelProperty(value = "服务大区ID")
    private String serviceRegionId;

    @NotBlank(message = "未选择省份")
    @ApiModelProperty(value = "省份")
    private String province;

    @NotBlank(message = "未选择城市")
    @ApiModelProperty(value = "城市")
    private String city;

    @ApiModelProperty(value = "详细地址")
    private String addres;

    @NotBlank(message = "未选择行业分类")
    @ApiModelProperty(value = "行业分类")
    private String industry;

    @NotBlank(message = "服务描述不能为空")
    @ApiModelProperty(value = "服务描述")
    private String serviceDesc;

    @NotBlank(message = "服务提供商不能为空")
    @ApiModelProperty(value = "服务提供商")
    private String serviceProvider;

    @NotNull(message = "未选择服务提供商是否显示")
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

    @ApiModelProperty(value = "状态（0：启用，1：停用）")
    private Integer status;

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


    @Override
    protected Serializable pkVal() {
        return this.chatbotId;
    }

}

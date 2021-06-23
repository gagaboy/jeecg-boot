package com.chinaunicom.business.chatbot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * <p>
 * chatbot账号审核表
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("chatbot_account_audit")
@ApiModel(value = "ChatbotAccountAudit对象", description = "chatbot账号审核表")
public class ChatbotAccountAudit extends Model<ChatbotAccountAudit> {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "chatbot账号ID")
    private String chatbotId;

    @ApiModelProperty(value = "审核状态（0：未审核，1：审核中，2：审核通过，-1：审核不通过）")
    private Integer auditStatus;

    @ApiModelProperty(value = "送审时间")
    private LocalDateTime verifyTime;

    @ApiModelProperty(value = "审核时间")
    private LocalDateTime auditTime;

    @ApiModelProperty(value = "失效时间")
    private LocalDateTime thruTime;

    @ApiModelProperty(value = "创建人")
    private String createBy;

    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "编辑人")
    private String updateBy;

    @ApiModelProperty(value = "修改时间")
    private Date updateTime;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}

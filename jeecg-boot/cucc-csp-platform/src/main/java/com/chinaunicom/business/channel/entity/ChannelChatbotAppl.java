package com.chinaunicom.business.channel.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * <p>
 * 通道关联Chatbot信息
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("channel_chatbot_appl")
@ApiModel(value="ChannelChatbotAppl对象", description="")
public class ChannelChatbotAppl extends Model<ChannelChatbotAppl> {

    private static final long serialVersionUID=1L;

    @TableId(value = "appl_id", type = IdType.ASSIGN_ID)
    private String applId;

    private String channelId;

    private String chatbotId;


    @Override
    protected Serializable pkVal() {
        return this.applId;
    }

}

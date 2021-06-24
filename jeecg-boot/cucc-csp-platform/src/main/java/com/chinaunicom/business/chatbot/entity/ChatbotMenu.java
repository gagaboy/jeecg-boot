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

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * chatbot固定菜单
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("chatbot_menu")
@ApiModel(value = "ChatbotMenu对象", description = "chatbot固定菜单")
public class ChatbotMenu extends Model<ChatbotMenu> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "menu_id", type = IdType.ASSIGN_ID)
    private String menuId;

    @ApiModelProperty(value = "归属chatbot")
    private String chatbotId;

    @NotBlank
    @ApiModelProperty(value = "菜单数据（json结构）")
    private String menuData;

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
        return this.menuId;
    }

}

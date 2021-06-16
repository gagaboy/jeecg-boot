package com.chinaunicom.business.entinfo.entity;

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

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 企业干系人
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("ent_person")
@ApiModel(value = "EntPerson对象", description = "企业干系人")
public class EntPerson extends Model<EntPerson> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "企业ID")
    private String entId;

    @ApiModelProperty(value = "干系人类型（contact：企业联系人，legal：法人）")
    private String personType;

    @ApiModelProperty(value = "干系人姓名")
    private String name;

    @ApiModelProperty(value = "干系人手机")
    private String phone;

    @ApiModelProperty(value = "干系人email")
    private String email;

    @ApiModelProperty(value = "干系人身份证号")
    private String idCard;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "生效时间")
    private Date fromTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "失效时间")
    private Date thruTime;

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
        return this.id;
    }

    /**
     * 企业干系人类型枚举类
     */
    public enum PersonTypeEnum {

        //企业联系人
        CONTACT("contact"),
        //法人
        LEGAL("legal");

        private String type;

        PersonTypeEnum(String type) {
            this.type = type;
        }

        /**
         * 判断参数合法性
         */
        public static boolean isValidType(String type) {
            PersonTypeEnum[] personTypeEnums = PersonTypeEnum.values();
            for (PersonTypeEnum typeEnum : personTypeEnums) {
                if (typeEnum.type.equals(type)) {
                    return true;
                }
            }
            return false;
        }
    }

}

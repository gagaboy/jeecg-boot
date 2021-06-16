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
 * 企业报备文件
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("ent_attachments")
@ApiModel(value = "EntAttachments对象", description = "企业报备文件")
public class EntAttachments extends Model<EntAttachments> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "企业客户ID")
    private String entId;

    @ApiModelProperty(value = "流水号（格式:yyyyMMddHHmmss+8 位随机字符，例：202011251251C4E1CB01(不可包含特殊字符)")
    private String nonce;

    @ApiModelProperty(value = "附件类型（ent_logo：企业logo，ent_biz_lic：企业经营执照，contract_file：合同文件，id_card_front：身份证正面，id_card_back：身份证反面）")
    private String fileType;

    @ApiModelProperty(value = "关联源表ID")
    private String sourceId;

    @ApiModelProperty(value = "本地文件路径")
    private String localUrl;

    @ApiModelProperty(value = "运营商路径")
    private String operatorUrl;

    @ApiModelProperty(value = "文件状态（0：已启用；1：已禁用）")
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
        return this.id;
    }

    /**
     * 企业报备文件类型常量类定义
     */
    public static class AttachmentFileType {

        //企业logo
        public static final String ENT_LOGO = "ent_logo";
        //企业经营执照
        public static final String ENT_BIZ_LIC = "ent_biz_lic";
        //合同文件
        public static final String CONTRACT_FILE = "contract_file";
        //身份证正面
        public static final String ID_CARD_FRONT = "id_card_front";
        //身份证反面
        public static final String ID_CARD_BACK = "id_card_back";

    }

}

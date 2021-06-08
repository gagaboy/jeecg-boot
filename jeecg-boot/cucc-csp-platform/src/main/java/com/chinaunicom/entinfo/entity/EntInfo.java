package com.chinaunicom.entinfo.entity;

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
 * 企业客户信息表
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("ent_info")
@ApiModel(value = "EntInfo对象", description = "企业客户信息表")
public class EntInfo extends Model<EntInfo> {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "企业信息表主键id")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "企业全称")
    private String entName;

    @ApiModelProperty(value = "企业简称")
    private String abbrName;

    @ApiModelProperty(value = "所属省份")
    private String province;

    @ApiModelProperty(value = "所属城市")
    private String city;

    @ApiModelProperty(value = "企业联系地址")
    private String address;

    @ApiModelProperty(value = "所属行业")
    private String industry;

    @ApiModelProperty(value = "企业级别（0：金牌级，1：银牌级，2：铜牌级，3：标准级（默认））")
    private String entGrade;

    @ApiModelProperty(value = "企业appID")
    private String appId;

    @ApiModelProperty(value = "企业秘钥")
    private String appSecret;

    @ApiModelProperty(value = "企业电话")
    private String entPhone;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "注册时间")
    private Date registTime;

    @ApiModelProperty(value = "企业状态（0：已启用；1：已禁用）")
    private Integer status;

    @ApiModelProperty(value = "备注")
    private String remark;

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

}

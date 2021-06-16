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
 * 企业合同信息表（合同类型、关联账号...）
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("ent_contracts")
@ApiModel(value = "EntContracts对象", description = "企业合同信息表（合同类型、关联账号...）")
public class EntContracts extends Model<EntContracts> {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "合同ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "企业ID")
    private String entId;

    @ApiModelProperty(value = "合同编号")
    private String contractCode;

    @ApiModelProperty(value = "合同名称")
    private String contractName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @ApiModelProperty(value = "合同起始时间")
    private Date fromTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @ApiModelProperty(value = "合同结束时间")
    private Date thruTime;

    @ApiModelProperty(value = "是否续签(0：是，1：否)")
    private Integer isRenew;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @ApiModelProperty(value = "合同续签时间")
    private Date renewTime;

    @ApiModelProperty(value = "合同状态（0：生效；1：失效）")
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

}

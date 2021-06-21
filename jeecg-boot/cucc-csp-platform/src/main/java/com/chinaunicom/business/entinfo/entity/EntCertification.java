package com.chinaunicom.business.entinfo.entity;

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

/**
 * <p>
 * 企业认证
 * </p>
 *
 * @author 木头人
 * @since 2021-06-18
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("ent_certification")
@ApiModel(value="EntCertification对象", description="企业认证")
public class EntCertification extends Model<EntCertification> {

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "企业ID")
    private String entId;

    @ApiModelProperty(value = "运营商")
    private String operator;

    @ApiModelProperty(value = "认证状态（0：未认证，1：认证中，2：认证通过，-1：认证不通过）")
    private Integer status;

    @ApiModelProperty(value = "csp客户识别码")
    private String cspEcNo;

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}

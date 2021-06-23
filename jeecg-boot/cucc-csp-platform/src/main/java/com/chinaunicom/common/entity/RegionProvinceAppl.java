package com.chinaunicom.common.entity;

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
 * 大区与省份关联表
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("region_province_appl")
@ApiModel(value="RegionProvinceAppl对象", description="服务大区与省份关联表")
public class RegionProvinceAppl extends Model<RegionProvinceAppl> {

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "服务大区ID（数据来源字典表）")
    private String regionId;

    @ApiModelProperty(value = "省份ID（数据来源省份信息表）")
    private String provinceId;

    @ApiModelProperty(value = "状态（0：启用，1：停用，-1：删除）")
    private Integer status;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}

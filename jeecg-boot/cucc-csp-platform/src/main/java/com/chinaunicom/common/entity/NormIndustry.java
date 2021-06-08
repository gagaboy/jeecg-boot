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
 * 标准行业表(GB/T 4754-2017)
 * </p>
 *
 * @author 木头人
 * @since 2021-06-08
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("norm_industry")
@ApiModel(value="NormIndustry对象", description="标准行业表(GB/T 4754-2017)")
public class NormIndustry extends Model<NormIndustry> {

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "自增数据ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "行业编号")
    private String code;

    @ApiModelProperty(value = "行业名称")
    private String name;

    @ApiModelProperty(value = "父行业编号")
    private String parentCode;

    @ApiModelProperty(value = "是否有子节点：1是，0否")
    private Integer hasChild;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}

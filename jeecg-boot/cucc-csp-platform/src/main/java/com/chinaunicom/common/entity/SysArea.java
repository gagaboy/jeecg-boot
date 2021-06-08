package com.chinaunicom.common.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * <p>
 *
 * </p>
 *
 * @author 木头人
 * @since 2021-06-07
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("sys_area")
@ApiModel(value="SysArea对象", description="地域信息表")
public class SysArea extends Model<SysArea> {

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "地区编码")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @ApiModelProperty(value = "地区名称")
    private String name;

    @JsonIgnore
    @ApiModelProperty(value = "上级地区编码")
    private String parentId;

    @JsonIgnore
    @ApiModelProperty(value = "区域类型（0：省，1：市，2：区县）")
    private Integer type;

    @JsonIgnore
    @ApiModelProperty(value = "中国移动编码")
    private String cmccCode;

    @JsonIgnore
    @ApiModelProperty(value = "中国联通编码")
    private String cuccCode;

    @JsonIgnore
    @ApiModelProperty(value = "中国电信编码")
    private String ctccCode;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}

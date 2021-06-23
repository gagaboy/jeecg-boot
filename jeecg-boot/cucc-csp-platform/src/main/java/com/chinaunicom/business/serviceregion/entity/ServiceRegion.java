package com.chinaunicom.business.serviceregion.entity;

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

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * <p>
 * 运营商大区表
 * </p>
 *
 * @author 木头人
 * @since 2021-06-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("service_region")
@ApiModel(value="ServiceRegion对象", description="运营商大区表")
public class ServiceRegion extends Model<ServiceRegion> {

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    @NotBlank(message = "未选择运营商")
    @ApiModelProperty(value = "运营商ID（数据来源字典表）")
    private String operatorId;

    @NotBlank(message = "未选择大区")
    @ApiModelProperty(value = "大区ID（数据来源字典表）")
    private String regionId;

    @ApiModelProperty(value = "服务大区编码（生成规则：运营商code+大区code）")
    private String serviceRegionCode;

    @NotBlank(message = "服务大区名称不能为空")
    @ApiModelProperty(value = "服务大区名称")
    private String serviceRegionName;

    @ApiModelProperty(value = "运营商大区消息发送等接口地址")
    private String serverRoot;

    @ApiModelProperty(value = "运营商大区素材审核接口地址")
    private String fileRoot;

    @NotBlank(message = "chatbot账号域名不能为空")
    @ApiModelProperty(value = "chatbot账号域名")
    private String chatbotDomain;

    @ApiModelProperty(value = "报备ip")
    private String reportIp;

    @ApiModelProperty(value = "上行回调地址")
    private String upCallbackUrl;

    @ApiModelProperty(value = "状态（0：正常状态，-1：删除状态）")
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

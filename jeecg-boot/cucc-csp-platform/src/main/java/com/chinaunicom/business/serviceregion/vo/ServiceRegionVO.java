package com.chinaunicom.business.serviceregion.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

/**
 * @author 木头人
 * @version 1.0
 * @description
 * @date 2021/6/21 15:13
 */
@Data
@ApiModel(value = "服务大区VO")
public class ServiceRegionVO {

    @ApiModelProperty(value = "ID")
    private String id;

    @ApiModelProperty(value = "运营商ID（数据来源字典表）")
    private String operatorId;

    @ApiModelProperty(value = "运营商名称")
    private String operatorName;

    @ApiModelProperty(value = "大区ID（数据来源字典表）")
    private String regionId;

    @ApiModelProperty(value = "大区名称")
    private String regionName;

    @ApiModelProperty(value = "服务大区编码（生成规则：运营商code+大区code）")
    private String serviceRegionCode;

    @ApiModelProperty(value = "服务大区名称")
    private String serviceRegionName;

    @ApiModelProperty(value = "运营商大区消息发送等接口地址")
    private String serverRoot;

    @ApiModelProperty(value = "运营商大区素材审核接口地址")
    private String fileRoot;

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
}

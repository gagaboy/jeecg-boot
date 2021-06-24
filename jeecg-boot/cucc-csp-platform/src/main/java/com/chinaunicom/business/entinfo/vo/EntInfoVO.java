package com.chinaunicom.business.entinfo.vo;

import com.chinaunicom.business.entinfo.entity.EntCertification;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;

/**
 * @author 木头人
 * @version 1.0
 * @description
 * @date 2021/6/2 16:52
 */
@Data
public class EntInfoVO {

    @ApiModelProperty(value = "企业信息表主键id")
    private String entId;

    @NotBlank(message = "企业编码不能为空")
    @ApiModelProperty(value = "企业编码")
    private String entCode;

    @NotBlank(message = "企业全称不能为空")
    @ApiModelProperty(value = "企业全称")
    private String entName;

    @NotBlank(message = "企业简称不能为空")
    @ApiModelProperty(value = "企业简称")
    private String abbrName;

    @NotBlank(message = "所属省份不能为空")
    @ApiModelProperty(value = "所属省份")
    private String province;

    @ApiModelProperty(value = "所属城市")
    private String city;

    @ApiModelProperty(value = "企业联系地址")
    private String address;

    @NotBlank(message = "所属行业不能为空")
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

    @NotBlank(message = "未上传企业logo")
    @ApiModelProperty(value = "企业logo url")
    private String logoUrl;

    @NotBlank(message = "未上传企业执照")
    @ApiModelProperty(value = "营业执照url")
    private String bizLicUrl;

    @ApiModelProperty(value = "行业名称")
    private String industryName;

    @ApiModelProperty(value = "省份名称")
    private String provinceName;

    @ApiModelProperty(value = "城市名称")
    private String cityName;

    @ApiModelProperty(value = "认证情况")
    private List<EntCertification> entCertificationList;
}

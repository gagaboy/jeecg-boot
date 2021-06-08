package com.chinaunicom.entinfo.vo;

import com.chinaunicom.common.validation.EnumValue;
import com.chinaunicom.entinfo.entity.EntPerson;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
  * @description
  *
  * @author 木头人
  * @date 2021/6/2 15:20
  * @version 1.0
  */
@Data
public class EntPersonVO {

    private String id;

    @ApiModelProperty(value = "企业ID")
    private String entId;

    @EnumValue(enumClass = EntPerson.PersonTypeEnum.class, enumMethod = "isValidType", message = "人员类型错误")
    @ApiModelProperty(value = "干系人类型（contact：企业联系人，legal：法人）")
    private String personType;

    @NotBlank(message = "姓名不能为空")
    @ApiModelProperty(value = "干系人姓名")
    private String name;

    @ApiModelProperty(value = "干系人手机")
    private String phone;

    @ApiModelProperty(value = "干系人email")
    private String email;

    @NotBlank(message = "身份证号不能为空")
    @ApiModelProperty(value = "干系人身份证号")
    private String idCard;

    @NotBlank(message = "未上传身份证正面照")
    @ApiModelProperty(value = "身份证正面")
    private String idCardFrontUrl;

    @NotBlank(message = "未上传身份证反面照")
    @ApiModelProperty(value = "身份证反面")
    private String idCardBackUrl;
}

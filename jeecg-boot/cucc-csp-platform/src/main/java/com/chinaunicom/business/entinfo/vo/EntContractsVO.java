package com.chinaunicom.business.entinfo.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.util.CollectionUtils;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.*;

/**
 * @author 木头人
 * @version 1.0
 * @description
 * @date 2021/6/2 16:34
 */
@Data
public class EntContractsVO {

    @ApiModelProperty(value = "合同ID")
    private String id;

    @ApiModelProperty(value = "企业ID")
    private String entId;

    @NotBlank(message = "合同编号不能为空")
    @ApiModelProperty(value = "合同编号")
    private String contractCode;

    @NotBlank(message = "合同名称不能为空")
    @ApiModelProperty(value = "合同名称")
    private String contractName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "合同生效日期不能为空")
    @ApiModelProperty(value = "合同生效时间")
    private Date fromTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "合同失效日期不能为空")
    @ApiModelProperty(value = "合同失效时间")
    private Date thruTime;

    @NotNull(message = "请选择是否续签")
    @ApiModelProperty(value = "是否续签(0：是，1：否)")
    private Integer isRenew;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @ApiModelProperty(value = "合同续签时间")
    private Date renewTime;

    @ApiModelProperty(value = "合同状态（0：生效；1：失效）")
    private Integer status;

    @Size(min = 1, message = "未上传合同附件")
    @ApiModelProperty(value = "合同附件URL")
    private List<String> contractsUrlList;

    /**
     * 便于前端编辑
     *
     * @return
     */
    public List getContractsUrlObjectList() {
        if (CollectionUtils.isEmpty(contractsUrlList)) {
            return new ArrayList();
        } else {
            List tempList = new ArrayList(contractsUrlList.size());
            contractsUrlList.forEach(contractsUrl -> {
                if (contractsUrl != null) {
                    Map tempMap = new HashMap(4);
                    tempMap.put("uid", UUID.randomUUID().toString());
                    tempMap.put("name", contractsUrl.substring(contractsUrl.lastIndexOf("/") + 1));
                    tempMap.put("status", "done");
                    tempMap.put("url", contractsUrl);
                    tempList.add(tempMap);
                }
            });
            return tempList;
        }
    }
}

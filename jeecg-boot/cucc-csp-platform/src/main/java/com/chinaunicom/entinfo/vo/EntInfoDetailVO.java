package com.chinaunicom.entinfo.vo;

import lombok.Data;

import javax.validation.Valid;
import java.util.List;

/**
 * @author 木头人
 * @version 1.0
 * @description 企业信息vo
 * @date 2021/6/2 14:54
 */
@Data
public class EntInfoDetailVO {

    @Valid
    private EntInfoVO entInfo;

    @Valid
    private List<EntPersonVO> entPersonList;

    @Valid
    private List<EntContractsVO> entContractsList;
}

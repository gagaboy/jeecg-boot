package com.chinaunicom.business.entinfo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.business.entinfo.entity.EntCertification;
import com.chinaunicom.business.entinfo.mapper.EntCertificationMapper;
import com.chinaunicom.business.entinfo.service.IEntCertificationService;
import com.chinaunicom.constants.CommonConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 企业认证 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-18
 */
@Service
public class EntCertificationServiceImpl extends ServiceImpl<EntCertificationMapper, EntCertification> implements IEntCertificationService {

    @Autowired
    private EntCertificationMapper entCertificationMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveEntCertificationBatch(String entId) {
        //保存企业认证信息
        List<EntCertification> certificationList = new ArrayList<>(4);
        certificationList.add(new EntCertification().setEntId(entId).setOperator(CommonConstant.OperatorConstant.OPERATOR_CUCC).setStatus(0));
        certificationList.add(new EntCertification().setEntId(entId).setOperator(CommonConstant.OperatorConstant.OPERATOR_CMCC).setStatus(0));
        certificationList.add(new EntCertification().setEntId(entId).setOperator(CommonConstant.OperatorConstant.OPERATOR_CTCC).setStatus(0));
        this.saveBatch(certificationList);
    }
}

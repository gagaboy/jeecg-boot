package com.chinaunicom.business.entinfo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.business.entinfo.entity.EntCertification;

/**
 * <p>
 * 企业认证 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-18
 */
public interface IEntCertificationService extends IService<EntCertification> {

    /**
     * 保存企业三网审核信息
     *
     * @param entId
     */
    void saveEntCertificationBatch(String entId);
}

package com.chinaunicom.common.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.common.entity.RegionProvinceAppl;
import com.chinaunicom.common.entity.SysArea;

import java.util.List;

/**
 * <p>
 * 大区与省份关联表 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
public interface IRegionProvinceApplService extends IService<RegionProvinceAppl> {

    /**
     * 根据大区与省份判断关联关系是否成立
     *
     * @param serviceRegionId
     * @param provinceId
     * @return
     */
    boolean checkRegionProvince(String serviceRegionId, String provinceId);

    /**
     * 根据大区获取大区关联的省份
     *
     * @param regionId
     * @return
     */
    List<SysArea> getProvinceByRegionId(String regionId);
}

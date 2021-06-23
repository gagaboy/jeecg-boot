package com.chinaunicom.common.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.business.serviceregion.entity.ServiceRegion;
import com.chinaunicom.business.serviceregion.service.IServiceRegionService;
import com.chinaunicom.common.entity.RegionProvinceAppl;
import com.chinaunicom.common.entity.SysArea;
import com.chinaunicom.common.mapper.RegionProvinceApplMapper;
import com.chinaunicom.common.service.IRegionProvinceApplService;
import com.chinaunicom.constants.StatusConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 大区与省份关联表 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
@Service
public class RegionProvinceApplServiceImpl extends ServiceImpl<RegionProvinceApplMapper, RegionProvinceAppl> implements IRegionProvinceApplService {

    @Autowired
    private RegionProvinceApplMapper regionProvinceApplMapper;

    @Autowired
    private IServiceRegionService serviceRegionService;

    @Override
    public boolean checkRegionProvince(String serviceRegionId, String provinceId) {
        ServiceRegion serviceRegion = serviceRegionService.getById(serviceRegionId);

        int count = regionProvinceApplMapper.selectCount(
                new LambdaQueryWrapper<>(RegionProvinceAppl.class)
                        .eq(RegionProvinceAppl::getRegionId, serviceRegion.getRegionId())
                        .eq(RegionProvinceAppl::getProvinceId, provinceId)
                        .eq(RegionProvinceAppl::getStatus, StatusConstant.STATUS_ENABLED));
        return count > 0 ? true : false;
    }

    @Override
    public List<SysArea> getProvinceByRegionId(String regionId) {
        return regionProvinceApplMapper.getProvinceByRegionId(regionId);
    }
}

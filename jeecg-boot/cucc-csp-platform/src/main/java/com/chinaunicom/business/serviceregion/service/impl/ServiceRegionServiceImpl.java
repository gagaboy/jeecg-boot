package com.chinaunicom.business.serviceregion.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.business.serviceregion.entity.ServiceRegion;
import com.chinaunicom.business.serviceregion.mapper.ServiceRegionMapper;
import com.chinaunicom.business.serviceregion.service.IServiceRegionService;
import com.chinaunicom.business.serviceregion.vo.ServiceRegionVO;
import com.chinaunicom.common.entity.SysArea;
import com.chinaunicom.common.service.IRegionProvinceApplService;
import com.chinaunicom.constants.StatusConstant;
import org.jeecg.modules.system.entity.SysDictItem;
import org.jeecg.modules.system.service.ISysDictItemService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

/**
 * <p>
 * 运营商大区表 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-21
 */
@Service
public class ServiceRegionServiceImpl extends ServiceImpl<ServiceRegionMapper, ServiceRegion> implements IServiceRegionService {

    @Autowired
    private ServiceRegionMapper serviceRegionMapper;

    @Autowired
    private ISysDictItemService sysDictItemService;

    @Autowired
    private IRegionProvinceApplService regionProvinceApplService;

    @Override
    public void saveServiceRegion(ServiceRegion serviceRegion) {
        //生成服务大区编码
        String serviceRegionCode = generateServiceRegion(serviceRegion);

        //校验该服务大区是否已存在
        int count = serviceRegionMapper.selectCount(new LambdaQueryWrapper<>(ServiceRegion.class).eq(ServiceRegion::getServiceRegionCode, serviceRegionCode).ne(ServiceRegion::getStatus, StatusConstant.STATUS_DELETE));
        Assert.isTrue(count <= 0, "该服务大区已存在，serviceRegionCode：" + serviceRegionCode);

        serviceRegion.setServiceRegionCode(serviceRegionCode);
        serviceRegion.setStatus(StatusConstant.STATUS_ENABLED);

        int insertCount = serviceRegionMapper.insert(serviceRegion);
        Assert.isTrue(insertCount > 0, "保存服务大区信息失败");
    }

    @Override
    public void updateServiceRegion(ServiceRegion serviceRegion) {
        ServiceRegion oldServiceRegion = serviceRegionMapper.selectOne(new LambdaQueryWrapper<>(ServiceRegion.class).eq(ServiceRegion::getId, serviceRegion.getId()).ne(ServiceRegion::getStatus, StatusConstant.STATUS_DELETE));
        Assert.notNull(oldServiceRegion, "数据不存在");
        //生成服务大区编码
        String serviceRegionCode = generateServiceRegion(serviceRegion);
        //校验该服务大区是否已存在
        int count = serviceRegionMapper.selectCount(new LambdaQueryWrapper<>(ServiceRegion.class).eq(ServiceRegion::getServiceRegionCode, serviceRegionCode).ne(ServiceRegion::getId, serviceRegion.getId()).ne(ServiceRegion::getStatus, StatusConstant.STATUS_DELETE));
        Assert.isTrue(count <= 0, "该服务大区已存在，serviceRegionCode：" + serviceRegionCode);
        BeanUtils.copyProperties(serviceRegion, oldServiceRegion);
        oldServiceRegion.setServiceRegionCode(serviceRegionCode);

        serviceRegionMapper.updateById(oldServiceRegion);
    }

    @Override
    public IPage<ServiceRegionVO> pageList(ServiceRegionVO serviceRegionVO, Page page) {
        return serviceRegionMapper.pageList(page, serviceRegionVO);
    }

    @Override
    public List<SysArea> listProvinceByServiceRegion(String serviceRegionId) {
        ServiceRegion serviceRegion = serviceRegionMapper.selectById(serviceRegionId);
        return regionProvinceApplService.getProvinceByRegionId(serviceRegion.getRegionId());
    }

    /**
     * 生成服务大区编码
     *
     * @param serviceRegion
     * @return
     */
    private String generateServiceRegion(ServiceRegion serviceRegion) {
        SysDictItem operator = sysDictItemService.getById(serviceRegion.getOperatorId());
        SysDictItem region = sysDictItemService.getById(serviceRegion.getRegionId());
        return operator.getItemValue() + region.getItemValue();
    }
}

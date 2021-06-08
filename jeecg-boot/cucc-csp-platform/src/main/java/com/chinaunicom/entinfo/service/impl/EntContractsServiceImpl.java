package com.chinaunicom.entinfo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.entinfo.entity.EntContracts;
import com.chinaunicom.entinfo.mapper.EntContractsMapper;
import com.chinaunicom.entinfo.service.IEntContractsService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 企业合同信息表（合同类型、关联账号...） 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
@Service
public class EntContractsServiceImpl extends ServiceImpl<EntContractsMapper, EntContracts> implements IEntContractsService {

}

package com.chinaunicom.entinfo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.entinfo.entity.EntPerson;
import com.chinaunicom.entinfo.mapper.EntPersonMapper;
import com.chinaunicom.entinfo.service.IEntPersonService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 企业干系人 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
@Service
public class EntPersonServiceImpl extends ServiceImpl<EntPersonMapper, EntPerson> implements IEntPersonService {

}

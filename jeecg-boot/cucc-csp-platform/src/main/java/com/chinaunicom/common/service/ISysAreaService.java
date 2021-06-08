package com.chinaunicom.common.service;

import cn.hutool.core.lang.tree.Tree;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.common.entity.SysArea;

import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-07
 */
public interface ISysAreaService extends IService<SysArea> {

    /**
     * 获取省市信息
     *
     * @return
     */
    List<Tree<String>> listAreaCascade();
}

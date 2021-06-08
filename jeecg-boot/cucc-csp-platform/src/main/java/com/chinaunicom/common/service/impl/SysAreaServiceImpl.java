package com.chinaunicom.common.service.impl;

import cn.hutool.core.lang.tree.Tree;
import cn.hutool.core.lang.tree.TreeNode;
import cn.hutool.core.lang.tree.TreeUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.common.entity.SysArea;
import com.chinaunicom.common.mapper.SysAreaMapper;
import com.chinaunicom.common.service.ISysAreaService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-07
 */
@Service
public class SysAreaServiceImpl extends ServiceImpl<SysAreaMapper, SysArea> implements ISysAreaService {

    @Override
    public List<Tree<String>> listAreaCascade() {
        List<SysArea> areaList = lambdaQuery().in(SysArea::getType, new Integer[]{0, 1}).list();
        List<TreeNode<String>> treeNodeList = new ArrayList<>(areaList.size());
        areaList.forEach(area -> {
            TreeNode<String> treeNode = new TreeNode();
            treeNode.setId(area.getId());
            treeNode.setName(area.getName());
            treeNode.setParentId(area.getParentId());
            treeNodeList.add(treeNode);
        });

        return TreeUtil.build(treeNodeList, "0");
    }
}

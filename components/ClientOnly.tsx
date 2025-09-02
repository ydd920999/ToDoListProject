'use client';

import React, { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

/**
 * 客户端专用组件，用于解决SSR与客户端渲染不一致的问题
 * 特别是由于浏览器扩展添加的额外属性导致的警告
 */
export default function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    // 清理可能由浏览器扩展添加的属性
    const cleanupExtensionAttributes = () => {
      // 移除常见的扩展属性
      const attributesToRemove = [
        'cz-shortcut-listen',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed'
      ];
      
      attributesToRemove.forEach(attr => {
        if (document.body.hasAttribute(attr)) {
          document.body.removeAttribute(attr);
        }
        if (document.documentElement.hasAttribute(attr)) {
          document.documentElement.removeAttribute(attr);
        }
      });
    };

    // 延迟执行清理，确保扩展已加载
    const timeoutId = setTimeout(cleanupExtensionAttributes, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

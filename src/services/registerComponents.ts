import { DailyRewards } from '@/components/exportable';
import { componentRegistry } from './ComponentRegistry';

/**
 * 注册所有可导出的组件
 * 这个函数应该在应用启动时调用一次
 */
export function registerComponents() {
  // 注册 DailyRewards 组件（本日奖励）
  componentRegistry.register({
    name: 'DailyRewards',
    component: DailyRewards,
    description: '本日奖励组件，展示每日奖励物品',
    defaultWidth: 250,
    defaultHeight: 321.7,
    defaultProps: {
      title: 'Rewards for today',
      items: [
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
      ],
      backgroundColor: '#313131',
      cardBackgroundColor: '#515151',
    },
  });

  console.log(
    `[registerComponents] Registered ${componentRegistry.size} components`,
  );
}

// 自动注册组件（在模块加载时）
registerComponents();

import { RewardsCard, DailyRewards, LiveBadge } from '@/components/exportable';
import { componentRegistry } from './ComponentRegistry';

/**
 * 注册所有可导出的组件
 * 这个函数应该在应用启动时调用一次
 */
export function registerComponents() {
  // 注册 RewardsCard 组件
  componentRegistry.register({
    name: 'RewardsCard',
    component: RewardsCard,
    description: '奖励卡片组件，显示今日奖励列表',
    defaultWidth: 250,
    defaultHeight: 321.7,
    defaultProps: {
      title: 'Rewards for today',
      items: [
        { name: 'Item 1', icon: '🎁' },
        { name: 'Item 2', icon: '💎' },
        { name: 'Item 3', icon: '⭐' },
        { name: 'Item 4', icon: '🪙' },
      ],
      backgroundColor: '#313131',
    },
  });

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

  // 注册 LiveBadge 组件（直播徽章）
  componentRegistry.register({
    name: 'LiveBadge',
    component: LiveBadge,
    description: '直播徽章组件，显示直播状态和观看人数',
    defaultWidth: 200,
    defaultHeight: 40,
    defaultProps: {
      text: 'LIVE',
      viewers: 1234,
      color: '#FF4458',
      animated: true,
    },
  });

  console.log(
    `[registerComponents] Registered ${componentRegistry.size} components`,
  );
}

// 自动注册组件（在模块加载时）
registerComponents();

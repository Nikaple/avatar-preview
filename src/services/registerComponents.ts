import {
  RewardsGrid,
  RewardsVertical,
  RewardsStep,
  LiveQuestion,
  LiveQuestionReward,
  LiveTitle,
  Introduction,
} from '@/components/exportable';
import { componentRegistry } from './ComponentRegistry';

/**
 * 注册所有可导出的组件
 * 这个函数应该在应用启动时调用一次
 */
export function registerComponents() {
  // 注册 RewardsGrid 组件（本日奖励-网格）
  componentRegistry.register({
    name: 'RewardsGrid',
    component: RewardsGrid,
    description: '本日奖励组件（网格布局），展示每日奖励物品',
    defaultWidth: 250,
    defaultHeight: 322,
    defaultProps: {
      title: 'Rewards for today',
      items: [
        { name: 'Item', color: '#10DCA9' },
        { name: 'Item', color: '#10DCA9' },
        { name: 'Item', color: '#10DCA9' },
        { name: 'Item', color: '#10DCA9' },
        { name: 'Item', color: '#10DCA9' },
        { name: 'Item', color: '#10DCA9' },
      ],
      backgroundColor: '#313131',
      cardBackgroundColor: '#515151',
    },
  });

  // 注册 RewardsVertical 组件（本日奖励-2宫格）
  componentRegistry.register({
    name: 'RewardsVertical',
    component: RewardsVertical,
    description: '本日奖励组件（纵向2宫格），展示每日奖励物品',
    defaultWidth: 246,
    defaultHeight: 347,
    defaultProps: {
      title: 'Rewards for Today',
      items: [
        { name: '60 UC', quantity: 'X15', color: '#10DCA9' },
        { name: '1000 VIP Points', quantity: 'X5', color: '#10DCA9' },
      ],
      backgroundColor: '#313131',
      cardBackgroundColor: '#515151',
    },
  });

  // 注册 RewardsStep 组件（累充活动）
  componentRegistry.register({
    name: 'RewardsStep',
    component: RewardsStep,
    description: '累充活动组件，展示累计充值活动的奖励阶梯',
    defaultWidth: 810,
    defaultHeight: 248,
    defaultProps: {
      items: [
        { amount: '60UC', name: 'Item', color: '#10DCA9' },
        { amount: '300UC', name: 'Item', color: '#10DCA9' },
        { amount: '600UC', name: 'Item', color: '#10DCA9' },
        { amount: '1500UC', name: 'Item', color: '#10DCA9' },
        { amount: '3000UC', name: 'Item', color: '#10DCA9' },
        { amount: '6000UC', name: 'Item', color: '#10DCA9' },
        { amount: '12000UC', name: 'Item', color: '#10DCA9' },
      ],
      backgroundColor: '#313131',
      cardBackgroundColor: '#515151',
      progressLineColor: '#5C5C5C',
      progressDotColor: '#5C5C5C',
      progressDotBorderColor: '#838383',
    },
  });

  // 注册 LiveQuestion 组件（问答）
  componentRegistry.register({
    name: 'LiveQuestion',
    component: LiveQuestion,
    description: '问答组件，展示直播问答活动',
    defaultWidth: 810,
    defaultHeight: 297,
    defaultProps: {
      hint: 'Leave your answer and PUBG MOBILE player ID',
      question:
        '"How many benefits can you enjoy by becoming a Midasbuy and PUBG MOBILE joint VIP?"',
      options: [
        { label: 'A', value: '3' },
        { label: 'B', value: '5' },
        { label: 'C', value: '7' },
      ],
      backgroundColor: '#313131',
      hintBackgroundColor: 'white',
    },
  });

  // 注册 LiveQuestionReward 组件（问答奖励）
  componentRegistry.register({
    name: 'LiveQuestionReward',
    component: LiveQuestionReward,
    description: '问答奖励组件，展示问答活动的奖励内容',
    defaultWidth: 224,
    defaultHeight: 227,
    defaultProps: {
      title: '5 Fans Each',
      rewardName: '60 UC',
      rewardColor: '#10DCA9',
      backgroundColor: '#313131',
      cardBackgroundColor: '#515151',
    },
  });

  // 注册 LiveTitle 组件（直播标题）
  componentRegistry.register({
    name: 'LiveTitle',
    component: LiveTitle,
    description: '直播标题组件，展示直播的网站和名称信息',
    defaultWidth: 830,
    defaultHeight: 135,
    defaultProps: {
      website: 'www.midasbuy.com',
      liveName: 'Midasbuy Live Name',
      websiteBackgroundColor: '#5A5A5A',
    },
  });

  // 注册 Introduction 组件（多业务介绍）
  componentRegistry.register({
    name: 'Introduction',
    component: Introduction,
    description: '多业务介绍组件，展示多个业务的介绍信息',
    defaultWidth: 810,
    defaultHeight: 288,
    defaultProps: {
      items: [
        { name: 'PUBG\nMOBILE', number: '1', color: '#10DCA9' },
        { name: 'Honor of\nKings', number: '2', color: '#10DCA9' },
        { name: 'Delta\nForce', number: '3', color: '#10DCA9' },
        { name: 'Age of Empires MOBILE', number: '4', color: '#10DCA9' },
        { name: 'Whiteout Survival', number: '5', color: '#10DCA9' },
      ],
      backgroundColor: '#313131',
      cardBackgroundColor: '#515151',
      progressLineColor: '#5C5C5C',
    },
  });

  console.log(
    `[registerComponents] Registered ${componentRegistry.size} components`,
  );
}

// 自动注册组件（在模块加载时）
registerComponents();

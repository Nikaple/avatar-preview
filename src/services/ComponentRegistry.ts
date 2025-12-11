import { RegisteredComponent } from '@/types/component';

/**
 * 组件注册表（单例模式）
 * 管理所有可导出的 React 组件
 */
export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, RegisteredComponent>;

  private constructor() {
    this.components = new Map();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  /**
   * 注册组件
   * @param config 组件配置
   * @throws 如果组件名称已存在
   */
  public register(config: RegisteredComponent): void {
    if (this.components.has(config.name)) {
      throw new Error(
        `Component "${config.name}" is already registered. Please use a unique name.`,
      );
    }

    this.components.set(config.name, config);
    console.log(`[ComponentRegistry] Registered component: ${config.name}`);
  }

  /**
   * 获取组件
   * @param name 组件名称
   * @returns 组件配置，如果不存在则返回 undefined
   */
  public get(name: string): RegisteredComponent | undefined {
    return this.components.get(name);
  }

  /**
   * 获取所有组件列表
   * @returns 所有已注册的组件配置数组
   */
  public list(): RegisteredComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * 验证组件是否存在
   * @param name 组件名称
   * @returns 如果组件存在返回 true，否则返回 false
   */
  public has(name: string): boolean {
    return this.components.has(name);
  }

  /**
   * 取消注册组件（主要用于测试）
   * @param name 组件名称
   */
  public unregister(name: string): boolean {
    return this.components.delete(name);
  }

  /**
   * 清空所有组件（主要用于测试）
   */
  public clear(): void {
    this.components.clear();
  }

  /**
   * 获取已注册组件数量
   */
  public get size(): number {
    return this.components.size;
  }
}

// 导出单例实例
export const componentRegistry = ComponentRegistry.getInstance();

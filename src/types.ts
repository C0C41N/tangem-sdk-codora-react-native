export interface INativeResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

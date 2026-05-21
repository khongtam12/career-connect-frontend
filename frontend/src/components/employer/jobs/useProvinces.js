import { useEffect, useState } from 'react';

let cachedProvinces = null;

export default function useProvinces(enabled = true) {
  const [provinces, setProvinces] = useState(cachedProvinces || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled) return;

    if (cachedProvinces) {
      setProvinces(cachedProvinces);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError('');

    const loadProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/v2/p/');
        if (!response.ok) throw new Error('Failed to load provinces');
        const data = await response.json();
        if (!ignore && Array.isArray(data)) {
          const normalized = data
            .map((item) => ({
              code: item.code,
              name: item.name,
            }))
            .filter((item) => item.name);
          cachedProvinces = normalized;
          setProvinces(normalized);
        }
      } catch {
        if (!ignore) setError('Không thể tải danh sách tỉnh/thành');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProvinces();
    return () => { ignore = true; };
  }, [enabled]);

  return { provinces, loading, error };
}

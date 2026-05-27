import { useEffect, useState } from 'react';

const cachedWardsByProvince = {};

export default function useWards(provinceCode, enabled = true) {
  const [wards, setWards] = useState(provinceCode ? (cachedWardsByProvince[provinceCode] || []) : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled || !provinceCode) {
      setWards([]);
      setLoading(false);
      setError('');
      return;
    }

    if (cachedWardsByProvince[provinceCode]) {
      setWards(cachedWardsByProvince[provinceCode]);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError('');

    const loadWards = async () => {
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`);
        if (!response.ok) throw new Error('Failed to load wards');
        const data = await response.json();
        const wardList = Array.isArray(data?.wards) ? data.wards : [];
        if (!ignore) {
          const normalized = wardList
            .map((item) => ({
              code: item.code,
              name: item.name,
            }))
            .filter((item) => item.name);
          cachedWardsByProvince[provinceCode] = normalized;
          setWards(normalized);
        }
      } catch {
        if (!ignore) setError('Không thể tải danh sách phường/xã');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadWards();
    return () => { ignore = true; };
  }, [provinceCode, enabled]);

  return { wards, loading, error };
}

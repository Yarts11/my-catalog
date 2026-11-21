import React from 'react';

const CATEGORIES = [
  { id: 'electronics', label: 'Электроника' },
  { id: 'jewelery', label: 'Ювелирные изделия' },
  { id: "men's clothing", label: 'Мужская одежда' },
  { id: "women's clothing", label: 'Женская одежда' },
];

const PRICE_SLIDER_MAX = 1000;

export function Filters({ onFilterChange, initialFilters }) {
  const [localCategories, setLocalCategories] = React.useState(initialFilters.categories || []);
  const [localMinPrice, setLocalMinPrice] = React.useState(String(initialFilters.minPrice || ''));
  const [localMaxPrice, setLocalMaxPrice] = React.useState(String(initialFilters.maxPrice || ''));

  const [errors, setErrors] = React.useState({});

  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel =
    localCategories.length === 0
      ? 'Все категории'
      : CATEGORIES.filter((cat) => localCategories.includes(cat.id))
          .map((cat) => cat.label)
          .join(', ');

  const validate = () => {
    const errs = {};
    const min = localMinPrice ? Number(localMinPrice) : undefined;
    const max = localMaxPrice ? Number(localMaxPrice) : undefined;

    if (min !== undefined && min < 0) {
      errs.min = 'Цена не может быть отрицательной';
    }
    if (max !== undefined && max < 0) {
      errs.max = 'Цена не может быть отрицательной';
    }
    if (
      min !== undefined && max !== undefined &&
      min >= 0 && max >= 0 &&
      min > max
    ) {
      errs.min = 'Цена «от» не может быть больше цены «до»';
      errs.max = 'Цена «до» не может быть меньше цены «от»';
    }
    return errs;
  };

  const handleCategoryToggle = (id) => {
    setLocalCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onFilterChange({
      categories: localCategories.length === 0 ? undefined : localCategories,
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
    });
  };

  const handleMinChange = (e) => {
    setLocalMinPrice(e.target.value);
    setErrors((prev) => ({ ...prev, min: '' }));
  };

  const handleMaxChange = (e) => {
    setLocalMaxPrice(e.target.value);
    setErrors((prev) => ({ ...prev, max: '' }));
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <label>Категории</label>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            style={{
              width: '100%',
              padding: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedLabel}
            </span>
            <span>{isOpen ? '▲' : '▼'}</span>
          </button>

          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                marginTop: '4px',
                padding: '8px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              {CATEGORIES.map((cat) => (
                <label key={cat.id} style={{ display: 'block', padding: '4px 0', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={localCategories.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                  />{' '}
                  {cat.label}
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <label>Цена от</label>
          <input
            type="number"
            value={localMinPrice}
            onChange={handleMinChange}
            placeholder="0"
            min="0"
            style={{
              width: '100%',
              padding: '8px',
              border: errors.min ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="range"
            min="0"
            max={PRICE_SLIDER_MAX}
            step="1"
            value={localMinPrice === '' ? 0 : Number(localMinPrice)}
            onChange={handleMinChange}
            style={{ width: '100%', cursor: 'pointer', marginTop: '8px' }}
          />
          {errors.min && (
            <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {errors.min}
            </span>
          )}
        </div>

        <div>
          <label>Цена до</label>
          <input
            type="number"
            value={localMaxPrice}
            onChange={handleMaxChange}
            placeholder="9999"
            min="0"
            style={{
              width: '100%',
              padding: '8px',
              border: errors.max ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="range"
            min="0"
            max={PRICE_SLIDER_MAX}
            step="1"
            value={localMaxPrice === '' ? PRICE_SLIDER_MAX : Number(localMaxPrice)}
            onChange={handleMaxChange}
            style={{ width: '100%', cursor: 'pointer', marginTop: '8px' }}
          />
          {errors.max && (
            <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {errors.max}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleApply}
        style={{
          padding: '10px 24px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Применить фильтры
      </button>
    </div>
  );
}
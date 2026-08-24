import React, { useState, useEffect, useRef } from 'react';
import { 
  Soup, 
  ChefHat, 
  Wheat, 
  Cookie, 
  Lock, 
  Unlock, 
  Plus, 
  X, 
  Check, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Leaf, 
  Dices, 
  Copy,
  Sun,
  Moon,
  Info,
  Vibrate,
  VibrateOff,
  BookOpen,
  Trash2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type MenuItem, MENU_DATABASE } from './data';
import { useSound } from './useSound';
import { useCountUp } from './useCountUp';

export default function App() {
  // --- Theme State (Adaptive Light / Dark MD3) ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('tencere_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tencere_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tencere_theme', 'light');
    }
  }, [darkMode]);

  // --- Audio Hooks ---
  const { playTickSound, playSuccessSound } = useSound();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('tencere_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // --- Haptics (Vibration) Hook ---
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('tencere_haptics');
    return saved !== null ? saved === 'true' : true;
  });

  // --- Layout State ---
  const [courseMode, setCourseMode] = useState<3 | 4>(() => {
    const saved = localStorage.getItem('tencere_mode');
    return saved ? (parseInt(saved) as 3 | 4) : 4;
  });

  const [dietFilter, setDietFilter] = useState<'all' | 'veg'>(() => {
    const saved = localStorage.getItem('tencere_filter');
    return saved === 'veg' ? 'veg' : 'all';
  });

  // --- Calorie Target States (Slider) ---
  const [maxCalories, setMaxCalories] = useState<number>(() => {
    const saved = localStorage.getItem('tencere_max_calories');
    return saved ? parseInt(saved) : 900;
  });
  const [calorieCapEnabled, setCalorieCapEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('tencere_calorie_cap_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // --- Custom Database State & Cache Synchronization ---
  const [uploadedItems, setUploadedItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('tencere_uploaded');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MenuItem[];
        // Filter out default items stored in tencere_uploaded to keep ONLY custom items
        return parsed.filter((item) => item.id.startsWith('custom_'));
      } catch (e) {
        console.warn('Failed to parse uploaded items: ', e);
      }
    }
    return [];
  });

  // Combine fresh MENU_DATABASE from data.ts and custom items
  const database = React.useMemo(() => {
    return [...MENU_DATABASE, ...uploadedItems];
  }, [uploadedItems]);

  // --- Filtering Helper ---
  const getFilteredItems = React.useCallback(
    (category: MenuItem['category']): MenuItem[] => {
      let pool = database.filter((item) => item.category === category);

      if (dietFilter === 'veg') {
        pool = pool.filter((item) => item.isVegetarian);
      }

      // Fallback to absolute pool if sub-filtering leaves it empty
      return pool.length > 0 ? pool : database.filter((item) => item.category === category);
    },
    [database, dietFilter]
  );

  // --- History tracking to prevent repetition (Fisher-Yates style filter) ---
  const recentSelectionsRef = useRef<Record<string, string[]>>({
    corba: [],
    ana_yemek: [],
    yardimci: [],
    tamamlayici: [],
  });

  const selectDiversifiedItem = (
    cat: MenuItem['category'], 
    pool: MenuItem[], 
    currentItem: MenuItem,
    updateHistory: boolean = false
  ): MenuItem => {
    if (pool.length === 0) return currentItem;
    if (pool.length === 1) return pool[0];

    const recentIds = recentSelectionsRef.current[cat] || [];
    
    // 1. Try to filter out both the currently visible item AND the last 3 picked items
    let candidates = pool.filter(
      (item) => item.id !== currentItem.id && !recentIds.includes(item.id)
    );

    // 2. If pool narrows too much, relax filters to just exclude current visible item
    if (candidates.length === 0) {
      candidates = pool.filter((item) => item.id !== currentItem.id);
    }

    // 3. Fallback to full pool if everything else fails
    if (candidates.length === 0) {
      candidates = pool;
    }

    const selected = candidates[Math.floor(Math.random() * candidates.length)];

    if (updateHistory) {
      // Keep only up to 3 recent items
      const nextRecent = [selected.id, ...recentIds].slice(0, 3);
      recentSelectionsRef.current[cat] = nextRecent;
    }

    return selected;
  };

  // --- Active Selection State ---
  const [selectedItems, setSelectedItems] = useState<Record<string, MenuItem>>(() => {
    const saved = localStorage.getItem('tencere_selected');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
    // Fallbacks
    return {
      corba: MENU_DATABASE.find((i) => i.category === 'corba')!,
      ana_yemek: MENU_DATABASE.find((i) => i.category === 'ana_yemek')!,
      yardimci: MENU_DATABASE.find((i) => i.category === 'yardimci')!,
      tamamlayici: MENU_DATABASE.find((i) => i.category === 'tamamlayici')!,
    };
  });

  // --- Startup cache synchronization & migrations effect ---
  useEffect(() => {
    // 1. Cross-reference selected items with the latest database to synchronize property changes
    setSelectedItems((prev) => {
      let changed = false;
      const next = { ...prev };
      
      const categories: MenuItem['category'][] = ['corba', 'ana_yemek', 'yardimci', 'tamamlayici'];
      categories.forEach((cat) => {
        const currentItem = prev[cat];
        const freshItem = database.find((i) => i.id === currentItem.id);
        
        if (freshItem) {
          // If properties differ, update to the latest fresh model
          if (
            freshItem.calories !== currentItem.calories || 
            freshItem.name !== currentItem.name || 
            freshItem.isVegetarian !== currentItem.isVegetarian
          ) {
            next[cat] = freshItem;
            changed = true;
          }
        } else {
          // Fallback if item no longer exists in default or custom database
          const fallback = database.find((i) => i.category === cat);
          if (fallback) {
            next[cat] = fallback;
            changed = true;
          }
        }
      });

      return changed ? next : prev;
    });

    // 2. Sync displayItems as well
    setDisplayItems((prev) => {
      let changed = false;
      const next = { ...prev };
      
      const categories: MenuItem['category'][] = ['corba', 'ana_yemek', 'yardimci', 'tamamlayici'];
      categories.forEach((cat) => {
        const currentItem = prev[cat];
        const freshItem = database.find((i) => i.id === currentItem.id);
        if (freshItem) {
          if (
            freshItem.calories !== currentItem.calories || 
            freshItem.name !== currentItem.name || 
            freshItem.isVegetarian !== currentItem.isVegetarian
          ) {
            next[cat] = freshItem;
            changed = true;
          }
        } else {
          const fallback = database.find((i) => i.category === cat);
          if (fallback) {
            next[cat] = fallback;
            changed = true;
          }
        }
      });

      return changed ? next : prev;
    });

    // 3. Migrate custom items from dinner spinner settings if they exist
    const oldUploaded = localStorage.getItem('dinner_spinner_uploaded');
    if (oldUploaded) {
      try {
        const parsed = JSON.parse(oldUploaded) as MenuItem[];
        const customOnly = parsed.filter(item => item.id.startsWith('custom_'));
        if (customOnly.length > 0) {
          setUploadedItems((prev) => {
            const existingIds = new Set(prev.map(i => i.id));
            const toAdd = customOnly.filter(i => !existingIds.has(i.id));
            return [...prev, ...toAdd];
          });
        }
      } catch (e) {
        console.warn('Failed to migrate legacy items: ', e);
      }
      localStorage.removeItem('dinner_spinner_uploaded');
    }
  }, [database]);

  // --- Locking State ---
  const [lockedSlots, setLockedSlots] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('tencere_locked');
    return saved ? JSON.parse(saved) : { corba: false, ana_yemek: false, yardimci: false, tamamlayici: false };
  });

  // --- Slot Spinning State & Display Items ---
  const [slotSpinning, setSlotSpinning] = useState<Record<string, boolean>>({
    corba: false,
    ana_yemek: false,
    yardimci: false,
    tamamlayici: false,
  });

  const [displayItems, setDisplayItems] = useState<Record<string, MenuItem>>({
    corba: selectedItems.corba,
    ana_yemek: selectedItems.ana_yemek,
    yardimci: selectedItems.yardimci,
    tamamlayici: selectedItems.tamamlayici,
  });

  const [slotSnapTriggers, setSlotSnapTriggers] = useState<Record<string, number>>({
    corba: 0,
    ana_yemek: 0,
    yardimci: 0,
    tamamlayici: 0,
  });

  const [spinning, setSpinning] = useState<boolean>(false);

  // --- Toast Feedback ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Copy Feedback State ---
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // --- Persistence Sync ---
  useEffect(() => {
    localStorage.setItem('tencere_sound', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('tencere_haptics', hapticsEnabled.toString());
  }, [hapticsEnabled]);

  useEffect(() => {
    localStorage.setItem('tencere_mode', courseMode.toString());
  }, [courseMode]);

  useEffect(() => {
    localStorage.setItem('tencere_filter', dietFilter);
  }, [dietFilter]);

  useEffect(() => {
    localStorage.setItem('tencere_max_calories', maxCalories.toString());
  }, [maxCalories]);

  useEffect(() => {
    localStorage.setItem('tencere_calorie_cap_enabled', calorieCapEnabled.toString());
  }, [calorieCapEnabled]);

  useEffect(() => {
    localStorage.setItem('tencere_uploaded', JSON.stringify(uploadedItems));
  }, [uploadedItems]);

  useEffect(() => {
    localStorage.setItem('tencere_selected', JSON.stringify(selectedItems));
  }, [selectedItems]);

  useEffect(() => {
    localStorage.setItem('tencere_locked', JSON.stringify(lockedSlots));
  }, [lockedSlots]);

  // Adjust active items when dataset/filters change if they don't exist in active pool
  useEffect(() => {
    const adjustSelectionForFilters = () => {
      setSelectedItems((prev) => {
        const next = { ...prev };
        let changed = false;

        const categories: MenuItem['category'][] = ['corba', 'ana_yemek', 'yardimci', 'tamamlayici'];
        categories.forEach((cat) => {
          const pool = getFilteredItems(cat);
          const currentItem = prev[cat];
          const exists = pool.some((i) => i.id === currentItem.id);

          // If current selection is not in filtered list and slot is NOT locked, update it
          if (!exists && !lockedSlots[cat] && pool.length > 0) {
            next[cat] = pool[0];
            changed = true;
          }
        });

        if (changed) {
          setDisplayItems(next);
        }

        return changed ? next : prev;
      });
    };

    adjustSelectionForFilters();
  }, [dietFilter, database, getFilteredItems]);

  // --- Modal Manual Upload State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<MenuItem['category']>('corba');
  const [formCalories, setFormCalories] = useState<number>(0);
  const [formIsVegetarian, setFormIsVegetarian] = useState(false);

  // --- Modal Database Archive State ---
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archiveTab, setArchiveTab] = useState<MenuItem['category']>('corba');
  const [searchQuery, setSearchQuery] = useState('');

  // --- High-Speed Reel Sequencer (Sound-Driven Pacing & Deceleration Snap) ---
  const startReelSequencer = (
    cat: MenuItem['category'],
    target: MenuItem,
    fastDurationMs: number,
    totalDurationMs: number
  ) => {
    if (lockedSlots[cat]) return;

    setSlotSpinning((prev) => ({ ...prev, [cat]: true }));
    
    const pool = getFilteredItems(cat);
    if (pool.length === 0) return;

    let elapsed = 0;
    let delay = 70; // 70ms tick rate during rapid cycle

    const tick = () => {
      elapsed += delay;

      // Check if we reached total duration
      if (elapsed >= totalDurationMs) {
        // SNAP PHASE
        setDisplayItems((prev) => ({ ...prev, [cat]: target }));
        setSelectedItems((prev) => ({ ...prev, [cat]: target }));
        setSlotSpinning((prev) => ({ ...prev, [cat]: false }));
        
        // Trigger CSS overshoot bounce snap
        setSlotSnapTriggers((prev) => ({ ...prev, [cat]: prev[cat] + 1 }));

        // Sound & Haptic on Settle
        if (soundEnabled) playTickSound(260, 0.08, 0.25);
        if (hapticsEnabled && navigator.vibrate) navigator.vibrate([12, 35, 12]);
        return;
      }

      // Flash completely random dish name from category pool
      const randomItem = pool[Math.floor(Math.random() * pool.length)] || target;
      setDisplayItems((prev) => ({ ...prev, [cat]: randomItem }));

      // Tick Audio & Haptics in sync with every fast item switch
      if (soundEnabled) {
        const baseFreq = cat === 'corba' ? 950 : cat === 'ana_yemek' ? 820 : cat === 'yardimci' ? 700 : 550;
        const progress = elapsed / totalDurationMs;
        const freq = baseFreq - progress * 350; // frequency glide down
        playTickSound(freq, 0.02, 0.12);
      }
      if (hapticsEnabled && navigator.vibrate) navigator.vibrate(6);

      // Deceleration algorithm: slow down pacing during final 20-30%
      if (elapsed < fastDurationMs) {
        delay = 70; // constant rapid-fire rate
      } else {
        const decelElapsed = elapsed - fastDurationMs;
        const decelTotal = totalDurationMs - fastDurationMs;
        const decelProgress = Math.min(1, decelElapsed / decelTotal);
        
        // Scale tick rate smoothly from 70ms -> 320ms
        delay = 70 + Math.pow(decelProgress, 2) * 250;
      }

      setTimeout(tick, delay);
    };

    setTimeout(tick, delay);
  };

  // --- Slot Locking Handler ---
  const toggleLock = (cat: MenuItem['category']) => {
    if (spinning || slotSpinning[cat]) return;
    setLockedSlots((prev) => ({ ...prev, [cat]: !prev[cat] }));
    if (soundEnabled) playTickSound(650, 0.04, 0.15);
    if (hapticsEnabled && navigator.vibrate) navigator.vibrate(10);
  };

  // --- Single Slot Spin (Dice roll - 1.2s total duration) ---
  const spinSingle = (cat: MenuItem['category']) => {
    if (spinning || slotSpinning[cat] || lockedSlots[cat]) return;

    const pool = getFilteredItems(cat);
    if (pool.length === 0) return;

    // Pick target ensuring true shuffle / no repeats
    let target = selectedItems[cat];
    let attempts = 0;
    while (attempts < 50) {
      const candidate = selectDiversifiedItem(cat, pool, selectedItems[cat], false);
      const nextSelection = { ...selectedItems, [cat]: candidate };
      const nextTotalKcal = 
        nextSelection.corba.calories + 
        nextSelection.ana_yemek.calories + 
        (courseMode === 4 ? nextSelection.yardimci.calories : 0) + 
        nextSelection.tamamlayici.calories;

      if (!calorieCapEnabled || nextTotalKcal <= maxCalories) {
        target = candidate;
        break;
      }
      attempts++;
    }

    // Update history only when settled
    recentSelectionsRef.current[cat] = [target.id, ...recentSelectionsRef.current[cat]].slice(0, 3);

    // 1.2s total: 0.9s fast cycle, 0.3s deceleration snap
    startReelSequencer(cat, target, 900, 1200);
  };

  // --- Spin Sequencer (All active slots - staggered stopping) ---
  const spinAll = () => {
    if (spinning) return;

    const activeCategories = courseMode === 4 
      ? ['corba', 'ana_yemek', 'yardimci', 'tamamlayici'] 
      : ['corba', 'ana_yemek', 'tamamlayici'];
    
    const allLocked = activeCategories.every((cat) => lockedSlots[cat]);
    if (allLocked) return;

    setSpinning(true);

    if (soundEnabled) {
      playTickSound(320, 0.08, 0.15);
      setTimeout(() => playTickSound(480, 0.08, 0.15), 45);
    }

    const filteredCorbas = getFilteredItems('corba');
    const filteredAnas = getFilteredItems('ana_yemek');
    const filteredYardimcis = getFilteredItems('yardimci');
    const filteredTamamlayicis = getFilteredItems('tamamlayici');

    // Run randomized choice matching calorie range goals
    let targetCorba = selectedItems.corba;
    let targetAna = selectedItems.ana_yemek;
    let targetYardimci = selectedItems.yardimci;
    let targetTamamlayici = selectedItems.tamamlayici;

    let attempts = 0;
    while (attempts < 100) {
      if (!lockedSlots.corba && filteredCorbas.length > 0) {
        targetCorba = selectDiversifiedItem('corba', filteredCorbas, selectedItems.corba, false);
      }
      if (!lockedSlots.ana_yemek && filteredAnas.length > 0) {
        targetAna = selectDiversifiedItem('ana_yemek', filteredAnas, selectedItems.ana_yemek, false);
      }
      if (courseMode === 4 && !lockedSlots.yardimci && filteredYardimcis.length > 0) {
        targetYardimci = selectDiversifiedItem('yardimci', filteredYardimcis, selectedItems.yardimci, false);
      }
      if (!lockedSlots.tamamlayici && filteredTamamlayicis.length > 0) {
        targetTamamlayici = selectDiversifiedItem('tamamlayici', filteredTamamlayicis, selectedItems.tamamlayici, false);
      }

      const totalKcal = 
        targetCorba.calories + 
        targetAna.calories + 
        (courseMode === 4 ? targetYardimci.calories : 0) + 
        targetTamamlayici.calories;

      if (!calorieCapEnabled || totalKcal <= maxCalories) {
        break;
      }
      attempts++;
    }

    // Commit history updates for selected winner items
    if (!lockedSlots.corba) {
      recentSelectionsRef.current.corba = [targetCorba.id, ...recentSelectionsRef.current.corba].slice(0, 3);
    }
    if (!lockedSlots.ana_yemek) {
      recentSelectionsRef.current.ana_yemek = [targetAna.id, ...recentSelectionsRef.current.ana_yemek].slice(0, 3);
    }
    if (courseMode === 4 && !lockedSlots.yardimci) {
      recentSelectionsRef.current.yardimci = [targetYardimci.id, ...recentSelectionsRef.current.yardimci].slice(0, 3);
    }
    if (!lockedSlots.tamamlayici) {
      recentSelectionsRef.current.tamamlayici = [targetTamamlayici.id, ...recentSelectionsRef.current.tamamlayici].slice(0, 3);
    }

    // Timings staggered deceleration:
    // Slot 1 (corba): 1.5s fast, snaps at 1.8s
    // Slot 2 (ana_yemek): 2.0s fast, snaps at 2.3s
    // Slot 3 (yardimci): 2.5s fast, snaps at 2.8s
    // Slot 4 (tamamlayici): 3.0s fast, snaps at 3.3s (if 4-course) or 2.5s fast, 2.8s total (if 3-course)
    const durations = {
      corba: { fast: 1500, total: 1800 },
      ana_yemek: { fast: 2000, total: 2300 },
      yardimci: { fast: 2500, total: 2800 },
      tamamlayici: courseMode === 4 
        ? { fast: 3000, total: 3300 } 
        : { fast: 2500, total: 2800 },
    };

    startReelSequencer('corba', targetCorba, durations.corba.fast, durations.corba.total);
    startReelSequencer('ana_yemek', targetAna, durations.ana_yemek.fast, durations.ana_yemek.total);
    if (courseMode === 4) {
      startReelSequencer('yardimci', targetYardimci, durations.yardimci.fast, durations.yardimci.total);
    }
    startReelSequencer('tamamlayici', targetTamamlayici, durations.tamamlayici.fast, durations.tamamlayici.total);

    const maxTotalDuration = courseMode === 4 ? durations.tamamlayici.total : durations.tamamlayici.total;
    setTimeout(() => {
      setSpinning(false);
      if (soundEnabled) playSuccessSound();
    }, maxTotalDuration);
  };

  // --- Custom Item Deletion in Archive ---
  const handleRemoveCustomItem = (id: string) => {
    if (window.confirm('Bu yemeği kalıcı olarak silmek istiyor musunuz?')) {
      const deletedItem = uploadedItems.find((i) => i.id === id);
      setUploadedItems((prev) => prev.filter((item) => item.id !== id));
      
      // Fallback selection if currently displayed item is deleted
      const categories: MenuItem['category'][] = ['corba', 'ana_yemek', 'yardimci', 'tamamlayici'];
      categories.forEach((cat) => {
        if (selectedItems[cat].id === id) {
          const fallback = MENU_DATABASE.find((i) => i.category === cat)!;
          setSelectedItems((prev) => ({ ...prev, [cat]: fallback }));
          setDisplayItems((prev) => ({ ...prev, [cat]: fallback }));
        }
      });

      showToast(`"${deletedItem?.name || 'Yemek'}" başarıyla silindi! 🗑️`);
    }
  };

  // --- Calorie Calculation ---
  const currentTotalCal = 
    selectedItems.corba.calories + 
    selectedItems.ana_yemek.calories + 
    (courseMode === 4 ? selectedItems.yardimci.calories : 0) + 
    selectedItems.tamamlayici.calories;

  const displayCal = useCountUp(currentTotalCal, 900);

  // --- Manual Food Form Submission ---
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formCalories <= 0) return;

    const newItem: MenuItem = {
      id: `custom_${Date.now()}`,
      name: formName.trim(),
      calories: formCalories,
      isVegetarian: formIsVegetarian,
      category: formCategory,
    };

    setUploadedItems((prev) => [...prev, newItem]);
    setIsModalOpen(false);

    // Reset inputs
    setFormName('');
    setFormCalories(0);
    setFormIsVegetarian(false);
    setFormCategory('corba');

    showToast(`"${newItem.name}" başarıyla eklendi! 🌱`);
    if (soundEnabled) playSuccessSound();
  };

  // Reset database back to defaults
  const resetDatabase = () => {
    if (window.confirm('Tüm eklediğiniz özel yemekleri sıfırlamak istiyor musunuz?')) {
      setUploadedItems([]);
      setSelectedItems({
        corba: MENU_DATABASE.find((i) => i.category === 'corba')!,
        ana_yemek: MENU_DATABASE.find((i) => i.category === 'ana_yemek')!,
        yardimci: MENU_DATABASE.find((i) => i.category === 'yardimci')!,
        tamamlayici: MENU_DATABASE.find((i) => i.category === 'tamamlayici')!,
      });
      setLockedSlots({ corba: false, ana_yemek: false, yardimci: false, tamamlayici: false });
      showToast('Özel yemekler sıfırlandı. 🔄');
      if (soundEnabled) playTickSound(400, 0.1, 0.15);
    }
  };

  // --- Copy Clipboard Share formatting ---
  const copyToClipboard = () => {
    const corbaLine = `🥣 ${selectedItems.corba.name} (${selectedItems.corba.calories} kcal)`;
    const anaLine = `🍲 ${selectedItems.ana_yemek.name} (${selectedItems.ana_yemek.calories} kcal)`;
    const yardimciLine = courseMode === 4 
      ? `🍚 ${selectedItems.yardimci.name} (${selectedItems.yardimci.calories} kcal)\n` 
      : '';
    const tamamlayiciLine = `🍮 ${selectedItems.tamamlayici.name} (${selectedItems.tamamlayici.calories} kcal)`;
    
    const text = `🍽️ Günün Menüsü:\n${corbaLine}\n${anaLine}\n${yardimciLine}${tamamlayiciLine}\n🔥 Toplam: ${currentTotalCal} kcal`;
    
    navigator.clipboard.writeText(text).then(() => {
      setShowCopyFeedback(true);
      if (soundEnabled) playTickSound(900, 0.05, 0.15);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  // --- Archive Stats calculations ---
  const totalDishes = database.length;
  const totalVegDishes = database.filter((i) => i.isVegetarian).length;
  const catCounts = {
    corba: database.filter((i) => i.category === 'corba').length,
    ana_yemek: database.filter((i) => i.category === 'ana_yemek').length,
    yardimci: database.filter((i) => i.category === 'yardimci').length,
    tamamlayici: database.filter((i) => i.category === 'tamamlayici').length,
  };

  // Filtered Archive List items
  const filteredArchive = database.filter((item) => {
    const matchesTab = item.category === archiveTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col justify-between bg-brand-bg text-brand-text p-4 font-sans select-none overflow-hidden safe-bottom transition-all duration-300">
      
      {/* Floating Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-brand-accent text-white font-black text-xs shadow-lg tracking-wider border border-brand-border/30 flex items-center gap-2"
          >
            <Check size={14} strokeWidth={3} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- APP BAR / HEADER --- */}
      <header className="flex items-center justify-between border-b border-brand-border pb-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-accent text-white rounded-xl shadow-[0_0_15px_rgba(72,108,47,0.2)]">
            <Leaf size={18} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black tracking-tight text-brand-text leading-tight uppercase">Tencere.app</h1>
            <p className="text-[9px] font-semibold text-brand-accent-alt uppercase tracking-widest leading-none">Organic Dinner</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Menu Mode Toggle */}
          <div className="flex bg-brand-card border border-brand-border rounded-xl p-0.5 text-[10px] font-bold">
            <button
              onClick={() => {
                if (spinning) return;
                setCourseMode(3);
                if (soundEnabled) playTickSound(600, 0.04, 0.1);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                courseMode === 3
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-brand-text-muted hover:text-brand-text'
              }`}
            >
              3'lü
            </button>
            <button
              onClick={() => {
                if (spinning) return;
                setCourseMode(4);
                if (soundEnabled) playTickSound(600, 0.04, 0.1);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                courseMode === 4
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-brand-text-muted hover:text-brand-text'
              }`}
            >
              4'lü
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-1.5 rounded-lg bg-brand-card border border-brand-border text-brand-text-muted hover:text-brand-text transition-colors cursor-pointer"
            title="Koyu / Açık Tema"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Haptic Toggle */}
          <button
            onClick={() => {
              setHapticsEnabled((prev) => !prev);
              if (!hapticsEnabled && navigator.vibrate) navigator.vibrate(20);
            }}
            className="p-1.5 rounded-lg bg-brand-card border border-brand-border text-brand-text-muted hover:text-brand-text transition-colors cursor-pointer"
            title="Titreşim Geri Bildirimi"
          >
            {hapticsEnabled ? <Vibrate size={14} /> : <VibrateOff size={14} className="text-red-400" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="p-1.5 rounded-lg bg-brand-card border border-brand-border text-brand-text-muted hover:text-brand-text transition-colors cursor-pointer"
            title="Ses Tıklamaları"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} className="text-red-400" />}
          </button>

          {/* Archive Book Button */}
          <button
            onClick={() => setIsArchiveOpen(true)}
            className="p-1.5 rounded-lg bg-brand-card border border-brand-border text-brand-text-muted hover:text-brand-text transition-colors cursor-pointer flex items-center justify-center"
            title="Yemek Arşivi"
          >
            <BookOpen size={14} />
          </button>

          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-lg bg-brand-accent text-white font-bold hover:bg-brand-accent/90 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
            title="Yemek Ekle"
          >
            <Plus size={14} />
          </button>
        </div>
      </header>

      {/* --- FILTER & CALORIE TARGET SLIDER CONTAINER --- */}
      <section className="bg-brand-card border border-brand-border rounded-2xl p-3 shrink-0 flex flex-col gap-2 mb-2">
        {/* Row 1: Veg / All Toggle & Calorie Cap Status */}
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex bg-brand-bg border border-brand-border rounded-xl p-0.5 w-44">
            <button
              onClick={() => {
                if (spinning) return;
                setDietFilter('all');
                if (soundEnabled) playTickSound(700, 0.04, 0.1);
              }}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                dietFilter === 'all'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-brand-text-muted hover:text-brand-text'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => {
                if (spinning) return;
                setDietFilter('veg');
                if (soundEnabled) playTickSound(700, 0.04, 0.1);
              }}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                dietFilter === 'veg'
                  ? 'bg-brand-accent/25 text-brand-accent border border-brand-accent/25 shadow-sm'
                  : 'text-brand-text-muted hover:text-brand-text'
              }`}
            >
              Vejetaryen
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-[10px] text-brand-text-muted uppercase tracking-wider">LİMİT:</span>
            <button
              type="button"
              onClick={() => {
                if (spinning) return;
                setCalorieCapEnabled((prev) => !prev);
                if (soundEnabled) playTickSound(600, 0.04, 0.1);
              }}
              className={`px-2.5 py-1 rounded-xl border text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                calorieCapEnabled
                  ? 'bg-brand-accent-alt/10 border-brand-accent-alt/30 text-brand-accent-alt dark:text-brand-accent'
                  : 'bg-brand-bg border-brand-border text-brand-text-muted'
              }`}
            >
              {calorieCapEnabled ? 'Açık' : 'Esnek'}
            </button>
          </div>
        </div>

        {/* Row 2: Range Slider */}
        <div className="flex items-center gap-3 mt-0.5">
          <input
            type="range"
            min="400"
            max="1600"
            step="50"
            disabled={!calorieCapEnabled || spinning}
            value={maxCalories}
            onChange={(e) => {
              setMaxCalories(parseInt(e.target.value));
              if (soundEnabled) playTickSound(500 + (maxCalories / 1600) * 400, 0.02, 0.08);
            }}
            className="flex-1 accent-brand-accent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          />
          <div className="text-xs font-black w-24 text-right shrink-0 text-brand-text">
            {calorieCapEnabled ? `Maks. ${maxCalories} kcal` : 'Limitsiz'}
          </div>
        </div>
      </section>

      {/* --- JACKPOT STAGE --- */}
      <main className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden py-1 justify-around">
        
        {/* SLOT 1: ÇORBA */}
        <SlotRow
          label="Çorba"
          category="corba"
          icon={<Soup size={13} className="text-brand-accent" />}
          locked={lockedSlots.corba}
          isSpinning={slotSpinning.corba}
          globalSpinning={spinning}
          displayItem={displayItems.corba}
          snapTrigger={slotSnapTriggers.corba}
          toggleLock={toggleLock}
          onReroll={spinSingle}
        />

        {/* SLOT 2: ANA YEMEK */}
        <SlotRow
          label="Ana Yemek"
          category="ana_yemek"
          icon={<ChefHat size={13} className="text-brand-accent" />}
          locked={lockedSlots.ana_yemek}
          isSpinning={slotSpinning.ana_yemek}
          globalSpinning={spinning}
          displayItem={displayItems.ana_yemek}
          snapTrigger={slotSnapTriggers.ana_yemek}
          toggleLock={toggleLock}
          onReroll={spinSingle}
        />

        {/* SLOT 3: YARDIMCI YEMEK (Optional 4-Course mode) */}
        {courseMode === 4 && (
          <SlotRow
            label="Yardımcı Yemek"
            category="yardimci"
            icon={<Wheat size={13} className="text-brand-accent" />}
            locked={lockedSlots.yardimci}
            isSpinning={slotSpinning.yardimci}
            globalSpinning={spinning}
            displayItem={displayItems.yardimci}
            snapTrigger={slotSnapTriggers.yardimci}
            toggleLock={toggleLock}
            onReroll={spinSingle}
          />
        )}

        {/* SLOT 4: TAMAMLAYICI GRUP */}
        <SlotRow
          label="Tamamlayıcı / Tatlı"
          category="tamamlayici"
          icon={<Cookie size={13} className="text-brand-accent" />}
          locked={lockedSlots.tamamlayici}
          isSpinning={slotSpinning.tamamlayici}
          globalSpinning={spinning}
          displayItem={displayItems.tamamlayici}
          snapTrigger={slotSnapTriggers.tamamlayici}
          toggleLock={toggleLock}
          onReroll={spinSingle}
        />
      </main>

      {/* --- FOOTER & CONTROLS --- */}
      <footer className="flex flex-col gap-2.5 mt-2 shrink-0">
        
        {/* CALORIE DISPLAY */}
        <div className="flex items-center justify-between px-2 bg-brand-card border border-brand-border rounded-2xl py-2.5 px-4 shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-brand-text-muted tracking-wider">TOPLAM MENÜ</span>
            {calorieCapEnabled && displayCal <= maxCalories && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-brand-accent/20 text-brand-accent">Hafif</span>
            )}
          </div>
          <div className="flex items-baseline gap-1 text-brand-text">
            <span className={`text-2xl font-black transition-colors ${
              calorieCapEnabled && displayCal > maxCalories ? 'text-red-500' : 'text-brand-accent'
            }`}>
              {displayCal}
            </span>
            <span className="text-xs text-brand-text-muted font-bold">kcal</span>
          </div>
        </div>

        {/* SPIN & SHARE ROW */}
        <div className="flex gap-2">
          {/* SPIN BUTTON */}
          <button
            onClick={spinAll}
            disabled={spinning}
            className={`flex-1 py-4 rounded-2xl text-white font-black text-lg tracking-widest shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-150 cursor-pointer ${
              spinning 
                ? 'bg-brand-card text-brand-text-muted border border-brand-border shadow-none cursor-wait'
                : 'bg-brand-accent-alt hover:bg-brand-accent shadow-brand-accent-alt/10'
            }`}
          >
            {spinning ? (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
              </div>
            ) : (
              'ÇEVİR'
            )}
          </button>

          {/* SHARE / COPY BUTTON */}
          <button
            onClick={copyToClipboard}
            className="px-5 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-text-muted text-brand-text-muted hover:text-brand-text transition-all flex items-center justify-center relative active:scale-95 duration-150 cursor-pointer"
            title="WhatsApp formatında kopyala"
          >
            <Copy size={20} />
            <AnimatePresence>
              {showCopyFeedback && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bg-brand-accent text-white font-black text-[10px] tracking-wider py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap"
                >
                  Kopyalandı! ✨
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </footer>

      {/* --- MANUAL ADD DISH MODAL (MD3 Bottom Sheet Dialog) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
            
            {/* Dark overlay close tap */}
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-full max-w-md bg-brand-card border-t border-x border-brand-border rounded-t-[32px] p-6 pb-8 overflow-hidden z-10 shadow-2xl"
            >
              {/* Drag handle line indicator (MD3 style) */}
              <div className="w-12 h-1.5 bg-brand-border/40 rounded-full mx-auto mb-5" />

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-brand-bg/60 text-brand-text-muted hover:text-brand-text transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Header Title */}
              <div className="mb-5">
                <h3 className="text-brand-text text-lg font-black flex items-center gap-1.5 uppercase">
                  <Plus size={18} className="text-brand-accent" />
                  YEMEK EKLE
                </h3>
                <p className="text-xs text-brand-text-muted">Veritabanına manuel olarak yeni bir yemek ekleyin.</p>
              </div>

              {/* FORM DETAILS */}
              <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                {/* Yemek Adı */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-brand-text-muted tracking-wider">Yemek Adı</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Örn: Mercimek Çorbası"
                    className="w-full bg-brand-bg border border-brand-border focus:border-brand-accent rounded-xl px-3.5 py-3 text-xs text-brand-text placeholder-brand-text-muted/40 focus:outline-none"
                    required
                  />
                </div>

                {/* Kategori */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-brand-text-muted tracking-wider">Kategori</label>
                  <div className="grid grid-cols-2 gap-1.5 bg-brand-bg border border-brand-border rounded-xl p-1">
                    {[
                      { label: 'Çorba', val: 'corba' },
                      { label: 'Ana Yemek', val: 'ana_yemek' },
                      { label: 'Yardımcı Yemek', val: 'yardimci' },
                      { label: 'Tamamlayıcı', val: 'tamamlayici' },
                    ].map((cat) => (
                      <button
                        key={cat.val}
                        type="button"
                        onClick={() => setFormCategory(cat.val as any)}
                        className={`py-2 px-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                          formCategory === cat.val
                            ? 'bg-brand-accent text-white shadow-sm'
                            : 'text-brand-text-muted hover:text-brand-text'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calorie & Vegetarian Switch */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Calorie */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-brand-text-muted tracking-wider">Kalori (kcal)</label>
                    <input
                      type="number"
                      value={formCalories === 0 ? '' : formCalories}
                      onChange={(e) => setFormCalories(parseInt(e.target.value) || 0)}
                      placeholder="Örn: 120"
                      min="1"
                      className="w-full bg-brand-bg border border-brand-border focus:border-brand-accent rounded-xl px-3.5 py-3 text-xs text-brand-text placeholder-brand-text-muted/40 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Veg Toggle */}
                  <div className="flex flex-col justify-end gap-1.5">
                    <label className="text-[10px] font-black uppercase text-brand-text-muted tracking-wider">Vejetaryen mi?</label>
                    <button
                      type="button"
                      onClick={() => setFormIsVegetarian((prev) => !prev)}
                      className={`flex items-center justify-between border rounded-xl px-3.5 py-3 text-xs font-bold transition-all cursor-pointer ${
                        formIsVegetarian
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-brand-bg border-brand-border text-brand-text-muted'
                      }`}
                    >
                      <span>{formIsVegetarian ? 'Evet 🌱' : 'Hayır'}</span>
                      <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                        formIsVegetarian ? 'bg-emerald-500' : 'bg-gray-500'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand-accent text-white font-extrabold text-xs tracking-wider transition-colors mt-2 cursor-pointer"
                >
                  LİSTEYE EKLE
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DATABASE ARCHIVE LIST MODAL --- */}
      <AnimatePresence>
        {isArchiveOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
            
            {/* Dark overlay close tap */}
            <div className="absolute inset-0" onClick={() => setIsArchiveOpen(false)} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-full max-w-md bg-brand-card border-t border-x border-brand-border rounded-t-[32px] p-5 pb-7 overflow-hidden z-10 shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Drag handle line indicator (MD3 style) */}
              <div className="w-12 h-1.5 bg-brand-border/40 rounded-full mx-auto mb-4 shrink-0" />

              {/* Close Button */}
              <button
                onClick={() => setIsArchiveOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-brand-bg/60 text-brand-text-muted hover:text-brand-text transition-all cursor-pointer z-20"
              >
                <X size={18} />
              </button>

              {/* Header Title */}
              <div className="mb-3 shrink-0">
                <h3 className="text-brand-text text-base font-black flex items-center gap-1.5 uppercase">
                  <BookOpen size={16} className="text-brand-accent" />
                  YEMEK ARŞİVİ
                </h3>
                <p className="text-[11px] text-brand-text-muted">Mevcut yemek listesini inceleyin ve düzenleyin.</p>
              </div>

              {/* STAT BADGES PANEL */}
              <div className="grid grid-cols-2 gap-2 bg-brand-bg/50 border border-brand-border/60 rounded-2xl p-3 mb-3 shrink-0 text-[10px] font-bold">
                <div className="flex items-center justify-between">
                  <span className="text-brand-text-muted">Toplam Yemek:</span>
                  <span className="text-brand-text bg-brand-badge border border-brand-border/25 px-2 py-0.5 rounded-full">{totalDishes} adet</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 dark:text-emerald-400">Vejetaryen 🌱:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{totalVegDishes} adet</span>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="relative mb-3 shrink-0">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Yemek adı ara..."
                  className="w-full bg-brand-bg border border-brand-border focus:border-brand-accent rounded-xl pl-9 pr-9 py-2 text-xs text-brand-text placeholder-brand-text-muted/40 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-brand-border/30 text-brand-text-muted hover:text-brand-text cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* CATEGORY SWITCH TAB PILLS */}
              <div className="grid grid-cols-4 gap-1 bg-brand-bg border border-brand-border rounded-xl p-0.5 text-[9px] font-black shrink-0 mb-3 select-none">
                {[
                  { label: 'Çorba', val: 'corba', count: catCounts.corba },
                  { label: 'Ana Yemek', val: 'ana_yemek', count: catCounts.ana_yemek },
                  { label: 'Yardımcı', val: 'yardimci', count: catCounts.yardimci },
                  { label: 'Tamamlayıcı', val: 'tamamlayici', count: catCounts.tamamlayici },
                ].map((tab) => (
                  <button
                    key={tab.val}
                    type="button"
                    onClick={() => setArchiveTab(tab.val as any)}
                    className={`py-2 px-0.5 rounded-lg text-center transition-all cursor-pointer ${
                      archiveTab === tab.val
                        ? 'bg-brand-accent text-white shadow-sm'
                        : 'text-brand-text-muted hover:text-brand-text'
                    }`}
                  >
                    <div>{tab.label}</div>
                    <div className="text-[7px] opacity-75 font-normal">({tab.count})</div>
                  </button>
                ))}
              </div>

              {/* LIST OF DISHES */}
              <div className="flex-1 overflow-y-auto no-scrollbar border border-brand-border bg-brand-bg/30 rounded-2xl p-1.5 min-h-[150px]">
                {filteredArchive.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {filteredArchive.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between gap-3 p-2 bg-brand-card/40 hover:bg-brand-card/85 rounded-xl border border-brand-border/30 transition-all"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-brand-text text-xs font-bold truncate">
                            {item.name}
                          </span>
                          {item.isVegetarian && (
                            <span className="shrink-0 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-md">🌱 Veg</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold bg-brand-badge text-brand-text-muted border border-brand-border/20 px-2 py-0.5 rounded-full">
                            {item.calories} kcal
                          </span>

                          {/* Delete option only for custom items */}
                          {item.id.startsWith('custom_') ? (
                            <button
                              onClick={() => handleRemoveCustomItem(item.id)}
                              className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                              title="Yemeği Sil"
                            >
                              <Trash2 size={12} />
                            </button>
                          ) : (
                            <div className="w-5" /> // spacing placeholder
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-brand-text-muted text-xs">
                    <Info size={20} className="mb-1 opacity-50" />
                    <span>Yemek bulunamadı.</span>
                  </div>
                )}
              </div>

              {/* Modal footer advanced actions */}
              <div className="flex justify-between items-center border-t border-brand-border pt-4 mt-4 shrink-0">
                <button
                  onClick={resetDatabase}
                  className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 px-3 py-1.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <RotateCcw size={10} />
                  Varsayılana Sıfırla
                </button>
                <div className="text-[9px] font-bold text-brand-text-muted">
                  Özel Eklenen: {uploadedItems.length}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SLOT ROW COMPONENT ---
interface SlotRowProps {
  label: string;
  category: MenuItem['category'];
  icon: React.ReactNode;
  locked: boolean;
  isSpinning: boolean;
  globalSpinning: boolean;
  displayItem: MenuItem;
  snapTrigger: number;
  toggleLock: (category: MenuItem['category']) => void;
  onReroll: (category: MenuItem['category']) => void;
}

function SlotRow({
  label,
  category,
  icon,
  locked,
  isSpinning,
  globalSpinning,
  displayItem,
  snapTrigger,
  toggleLock,
  onReroll,
}: SlotRowProps) {

  return (
    <div className={`flex flex-col justify-between flex-1 min-h-0 p-3 rounded-2xl border transition-all duration-300 ${
      locked 
        ? 'bg-brand-bg border-brand-accent/20 opacity-80' 
        : 'bg-brand-card border-brand-border hover:border-brand-accent/30'
    }`}>
      
      {/* Title & Lock / Dice Controls */}
      <div className="flex items-center justify-between text-[10px] font-bold text-brand-text-muted select-none">
        <div className="flex items-center gap-1.5 uppercase tracking-widest">
          {icon}
          <span>{label}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {/* Individual dice roll trigger */}
          {!locked && (
            <button
              onClick={() => onReroll(category)}
              disabled={isSpinning || globalSpinning}
              className="p-1.5 rounded-lg border bg-brand-bg/60 border-transparent text-brand-text-muted hover:text-brand-text hover:bg-brand-border/20 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
              title="Yalnızca Bu Slotu Çevir"
            >
              <Dices size={12} className={isSpinning ? 'animate-[spin_1s_linear_infinite]' : ''} />
            </button>
          )}

          {/* Lock Button */}
          <button
            onClick={() => toggleLock(category)}
            disabled={isSpinning || globalSpinning}
            className={`p-1.5 rounded-lg border transition-all duration-200 disabled:opacity-50 cursor-pointer ${
              locked
                ? 'bg-brand-accent/15 border-brand-accent/35 text-brand-accent shadow-md'
                : 'bg-brand-bg/60 border-transparent text-brand-text-muted hover:text-brand-text'
            }`}
          >
            {locked ? <Lock size={12} className="fill-brand-accent/10 animate-[bounce_0.2s_1]" /> : <Unlock size={12} />}
          </button>
        </div>
      </div>

      {/* Reel Window Viewport (72px–80px height viewport window) */}
      <div className="relative flex-1 min-h-0 flex items-center overflow-hidden my-1">
        <div className="w-full h-20 overflow-hidden relative flex items-center justify-center">
          
          {/* Re-mount display container using unique keys to trigger snapping animations */}
          <div
            key={`${displayItem.id}-${snapTrigger}`}
            className={`w-full h-full flex items-center justify-between gap-3 px-1 ${
              isSpinning ? 'blur-motion' : 'animate-reel-snap'
            }`}
          >
            <span className="text-brand-text text-sm md:text-base font-extrabold truncate max-w-[72%] tracking-wide">
              {displayItem.name}
            </span>
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black bg-brand-badge text-brand-text-muted border border-brand-border/30">
              {displayItem.calories} kcal
            </span>
          </div>

        </div>

        {/* Ambient Top & Bottom Vignette Mask */}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-brand-card to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-brand-card to-transparent pointer-events-none z-10" />
      </div>

    </div>
  );
}

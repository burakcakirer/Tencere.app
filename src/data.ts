export interface MenuItem {
  id: string;
  name: string;
  calories: number;
  isVegetarian: boolean;
  category: 'corba' | 'ana_yemek' | 'yardimci' | 'tamamlayici';
}

export const MENU_DATABASE: MenuItem[] = [
  // =========================================================
  // ÇORBALAR
  // =========================================================

  { id: 'c1', name: 'Mercimek Çorbası', calories: 140, isVegetarian: true, category: 'corba' },
  { id: 'c2', name: 'Ezogelin Çorbası', calories: 90, isVegetarian: true, category: 'corba' },
  { id: 'c3', name: 'Tarhana Çorbası', calories: 135, isVegetarian: true, category: 'corba' },
  { id: 'c4', name: 'Yayla Çorbası', calories: 134, isVegetarian: true, category: 'corba' },
  { id: 'c5', name: 'Domates Çorbası', calories: 120, isVegetarian: true, category: 'corba' },
  { id: 'c6', name: 'Sebze Çorbası', calories: 88, isVegetarian: true, category: 'corba' },
  { id: 'c7', name: 'Kremalı Sebze Çorbası', calories: 104, isVegetarian: true, category: 'corba' },
  { id: 'c8', name: 'Tel Şehriye Çorbası', calories: 152, isVegetarian: true, category: 'corba' },
  { id: 'c9', name: 'Tutmaç Çorbası', calories: 128, isVegetarian: true, category: 'corba' },
  { id: 'c10', name: 'Köylü Çorbası', calories: 160, isVegetarian: true, category: 'corba' },

  { id: 'c11', name: 'Soğuk Çorba', calories: 126, isVegetarian: true, category: 'corba' },
  { id: 'c12', name: 'Yoğurt Çorbası', calories: 140, isVegetarian: true, category: 'corba' },
  { id: 'c13', name: 'Mantar Çorbası', calories: 145, isVegetarian: true, category: 'corba' },
  { id: 'c14', name: 'Brokoli Çorbası', calories: 115, isVegetarian: true, category: 'corba' },
  { id: 'c15', name: 'Kabak Çorbası', calories: 110, isVegetarian: true, category: 'corba' },
  { id: 'c16', name: 'Karnabahar Çorbası', calories: 115, isVegetarian: true, category: 'corba' },
  { id: 'c17', name: 'Un Çorbası', calories: 165, isVegetarian: true, category: 'corba' },
  { id: 'c18', name: 'Erişteli Yeşil Mercimek Çorbası', calories: 200, isVegetarian: true, category: 'corba' },
  { id: 'c19', name: 'Düğün Çorbası', calories: 190, isVegetarian: false, category: 'corba' },
  { id: 'c20', name: 'Tavuk Çorbası', calories: 144, isVegetarian: false, category: 'corba' },

  { id: 'c21', name: 'Tavuk Suyu Çorbası', calories: 150, isVegetarian: false, category: 'corba' },
  { id: 'c22', name: 'Şehriyeli Tavuk Çorbası', calories: 175, isVegetarian: false, category: 'corba' },
  { id: 'c23', name: 'Arabaşı Çorbası', calories: 148, isVegetarian: false, category: 'corba' },
  { id: 'c24', name: 'İşkembe Çorbası', calories: 220, isVegetarian: false, category: 'corba' },
  { id: 'c25', name: 'Mercimekli Erişte Çorbası', calories: 195, isVegetarian: true, category: 'corba' },
  { id: 'c26', name: 'Bulgur Çorbası', calories: 150, isVegetarian: true, category: 'corba' },
  { id: 'c27', name: 'Mahluta Çorbası', calories: 150, isVegetarian: true, category: 'corba' },
  { id: 'c28', name: 'Ovmaç Çorbası', calories: 170, isVegetarian: true, category: 'corba' },


  // =========================================================
  // ANA YEMEKLER - ET / KIYMA / KÖFTE
  // =========================================================

  { id: 'm1', name: 'Karnıyarık', calories: 285, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm2', name: 'Patlıcan Musakka', calories: 350, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm3', name: 'Kabak Musakka', calories: 310, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm4', name: 'İzmir Köfte', calories: 350, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm5', name: 'Hasanpaşa Köfte', calories: 454, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm6', name: 'İslim Köfte', calories: 400, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm7', name: 'Akçaabat Köfte', calories: 420, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm8', name: 'Sulu Köfte', calories: 380, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm9', name: 'Terbiyeli Sulu Köfte', calories: 400, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm10', name: 'Kadınbudu Köfte', calories: 430, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm11', name: 'Fırında Köfte Patates', calories: 480, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm12', name: 'Köfte', calories: 400, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm13', name: 'Tas Kebabı', calories: 377, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm14', name: 'Tepsi Kebabı', calories: 430, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm15', name: 'Parmak Kebabı', calories: 450, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm16', name: 'Orman Kebabı', calories: 380, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm17', name: 'Hünkar Beğendi', calories: 480, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm18', name: 'Ali Nazik', calories: 450, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm19', name: 'Et Kavurma', calories: 450, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm20', name: 'Çoban Kavurma', calories: 400, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm21', name: 'Et Sote', calories: 390, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm22', name: 'Etli Kuru Fasulye', calories: 292, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm23', name: 'Etli Nohut', calories: 427, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm24', name: 'Etli Yeşil Mercimek', calories: 350, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm25', name: 'Etli Taze Fasulye', calories: 280, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm26', name: 'Etli Bezelye', calories: 300, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm27', name: 'Etli Patates Yemeği', calories: 330, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm28', name: 'Etli Türlü', calories: 310, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm29', name: 'Etli Bamya', calories: 260, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm30', name: 'Etli Barbunya', calories: 320, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm31', name: 'Kıymalı Ispanak', calories: 260, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm32', name: 'Kıymalı Pırasa', calories: 250, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm33', name: 'Kıymalı Kabak Yemeği', calories: 270, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm34', name: 'Kıymalı Karnabahar', calories: 280, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm35', name: 'Kıymalı Bezelye', calories: 300, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm36', name: 'Kıymalı Patates Yemeği', calories: 340, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm37', name: 'Etli Biber Dolması', calories: 298, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm38', name: 'Etli Kabak Dolması', calories: 320, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm39', name: 'Etli Patlıcan Dolması', calories: 340, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm40', name: 'Etli Yaprak Sarma', calories: 350, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm41', name: 'Etli Lahana Sarma', calories: 370, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm42', name: 'Etli Mantı', calories: 425, isVegetarian: false, category: 'ana_yemek' },


  // =========================================================
  // ANA YEMEKLER - TAVUK
  // =========================================================

  { id: 'm43', name: 'Tavuk Sote', calories: 330, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm44', name: 'Sebzeli Tavuk Sote', calories: 310, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm45', name: 'Fırında Tavuk', calories: 360, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm46', name: 'Fırında Tavuk Patates', calories: 450, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm47', name: 'Tavuk Haşlama', calories: 320, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm48', name: 'Tavuklu Bezelye', calories: 300, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm49', name: 'Tavuklu Patates Yemeği', calories: 340, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm50', name: 'Köri Soslu Tavuk', calories: 422, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm51', name: 'Tavuk Döner ve Garnitür', calories: 286, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm52', name: 'Fırın Sebzeli Piliç Roti', calories: 330, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm53', name: 'Garnitürlü Piliç Pirzola', calories: 275, isVegetarian: false, category: 'ana_yemek' },

  { id: 'm54', name: 'Tavuk Güveç', calories: 350, isVegetarian: false, category: 'ana_yemek' },
  { id: 'm55', name: 'Tavuklu Sebze Yemeği', calories: 320, isVegetarian: false, category: 'ana_yemek' },


  // =========================================================
  // ANA YEMEKLER - SEBZE / BAKLİYAT / VEJETARYEN
  // =========================================================

  { id: 'v1', name: 'Zeytinyağlı Taze Fasulye', calories: 190, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v2', name: 'Zeytinyağlı Bamya', calories: 150, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v3', name: 'Zeytinyağlı Pırasa', calories: 180, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v4', name: 'Zeytinyağlı Enginar', calories: 180, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v5', name: 'Zeytinyağlı Kereviz', calories: 170, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v6', name: 'Zeytinyağlı Kabak', calories: 160, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v7', name: 'Zeytinyağlı Ispanak', calories: 180, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v8', name: 'Etsiz Kuru Fasulye', calories: 245, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v9', name: 'Etsiz Nohut Yemeği', calories: 410, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v10', name: 'Etsiz Yeşil Mercimek Yemeği', calories: 300, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v11', name: 'Etsiz Bezelye', calories: 240, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v12', name: 'Etsiz Patates Yemeği', calories: 260, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v13', name: 'Etsiz Türlü', calories: 220, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v14', name: 'Ispanak Yemeği', calories: 190, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v15', name: 'Pırasa Yemeği', calories: 180, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v16', name: 'Kabak Yemeği', calories: 170, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v17', name: 'Karnabahar Yemeği', calories: 190, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v18', name: 'Patlıcan Yemeği', calories: 230, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v19', name: 'Barbunya Pilaki', calories: 280, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v20', name: 'İmam Bayıldı', calories: 300, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v21', name: 'Zeytinyağlı Yaprak Sarma', calories: 300, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v22', name: 'Zeytinyağlı Biber Dolması', calories: 280, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v23', name: 'Kabak Mücver', calories: 300, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v24', name: 'Mercimek Köftesi', calories: 290, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v25', name: 'Patates Borani', calories: 250, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v26', name: 'Beşamel Soslu Brokoli', calories: 280, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v27', name: 'Beşamel Soslu Ispanak', calories: 280, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v28', name: 'Karışık Kızartma', calories: 410, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v29', name: 'Karnabahar Havuç Kızartması', calories: 350, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v30', name: 'Sebze Buketi', calories: 180, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v31', name: 'Fırın Sebze Sote', calories: 210, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v32', name: 'Fırın Sebze Graten', calories: 300, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v33', name: 'Kabak Kalye', calories: 145, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v34', name: 'Sebzeli Güveç', calories: 240, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v35', name: 'Menemen', calories: 260, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v36', name: 'Patatesli Yumurta', calories: 350, isVegetarian: true, category: 'ana_yemek' },
  { id: 'v37', name: 'Ispanaklı Yumurta', calories: 250, isVegetarian: true, category: 'ana_yemek' },

  { id: 'v38', name: 'Vejetaryen Pizza', calories: 300, isVegetarian: true, category: 'ana_yemek' },

  { id: 'm56', name: 'Karışık Pizza', calories: 580, isVegetarian: false, category: 'ana_yemek' },


  // =========================================================
  // YARDIMCI YEMEKLER
  // =========================================================

  { id: 's1', name: 'Pirinç Pilavı', calories: 310, isVegetarian: true, category: 'yardimci' },
  { id: 's2', name: 'Şehriyeli Pirinç Pilavı', calories: 310, isVegetarian: true, category: 'yardimci' },
  { id: 's3', name: 'Arpa Şehriyeli Pirinç Pilavı', calories: 310, isVegetarian: true, category: 'yardimci' },
  { id: 's4', name: 'Mısırlı Pirinç Pilavı', calories: 310, isVegetarian: true, category: 'yardimci' },
  { id: 's5', name: 'Sebzeli Pirinç Pilavı', calories: 300, isVegetarian: true, category: 'yardimci' },
  { id: 's6', name: 'Nohutlu Pirinç Pilavı', calories: 360, isVegetarian: true, category: 'yardimci' },

  { id: 's7', name: 'Bulgur Pilavı', calories: 270, isVegetarian: true, category: 'yardimci' },
  { id: 's8', name: 'Sebzeli Bulgur Pilavı', calories: 220, isVegetarian: true, category: 'yardimci' },
  { id: 's9', name: 'Domatesli Bulgur Pilavı', calories: 260, isVegetarian: true, category: 'yardimci' },
  { id: 's10', name: 'Tel Şehriyeli Bulgur Pilavı', calories: 285, isVegetarian: true, category: 'yardimci' },
  { id: 's11', name: 'Meyhane Pilavı', calories: 325, isVegetarian: true, category: 'yardimci' },

  { id: 's12', name: 'Makarna', calories: 300, isVegetarian: true, category: 'yardimci' },
  { id: 's13', name: 'Salçalı Makarna', calories: 330, isVegetarian: true, category: 'yardimci' },
  { id: 's14', name: 'Soslu Makarna', calories: 322, isVegetarian: true, category: 'yardimci' },
  { id: 's15', name: 'Yoğurtlu Makarna', calories: 350, isVegetarian: true, category: 'yardimci' },
  { id: 's16', name: 'Kıymalı Makarna', calories: 360, isVegetarian: false, category: 'yardimci' },
  { id: 's17', name: 'Fırın Makarna', calories: 420, isVegetarian: true, category: 'yardimci' },

  { id: 's18', name: 'Erişte', calories: 310, isVegetarian: true, category: 'yardimci' },
  { id: 's19', name: 'Sebzeli Erişte', calories: 220, isVegetarian: true, category: 'yardimci' },
  { id: 's20', name: 'Cevizli Erişte', calories: 390, isVegetarian: true, category: 'yardimci' },

  { id: 's21', name: 'Kısır', calories: 275, isVegetarian: true, category: 'yardimci' },

  { id: 's22', name: 'Patates Püresi', calories: 230, isVegetarian: true, category: 'yardimci' },
  { id: 's23', name: 'Fırında Patates', calories: 250, isVegetarian: true, category: 'yardimci' },
  { id: 's24', name: 'Patates Kızartması', calories: 420, isVegetarian: true, category: 'yardimci' },

  { id: 's25', name: 'Peynirli Börek', calories: 410, isVegetarian: true, category: 'yardimci' },
  { id: 's26', name: 'Su Böreği', calories: 430, isVegetarian: true, category: 'yardimci' },
  { id: 's27', name: 'Ispanaklı Börek', calories: 370, isVegetarian: true, category: 'yardimci' },
  { id: 's28', name: 'Patatesli Börek', calories: 390, isVegetarian: true, category: 'yardimci' },
  { id: 's29', name: 'Gül Böreği', calories: 400, isVegetarian: true, category: 'yardimci' },
  { id: 's30', name: 'Sigara Böreği', calories: 350, isVegetarian: true, category: 'yardimci' },

  { id: 's31', name: 'Yoğurtlu Mantı', calories: 450, isVegetarian: false, category: 'yardimci' },


  // =========================================================
  // TAMAMLAYICILAR - YOĞURT / SALATA / MEZE
  // =========================================================

  { id: 't1', name: 'Yoğurt', calories: 120, isVegetarian: true, category: 'tamamlayici' },
  { id: 't2', name: 'Sarımsaklı Yoğurt', calories: 130, isVegetarian: true, category: 'tamamlayici' },
  { id: 't3', name: 'Ayran', calories: 50, isVegetarian: true, category: 'tamamlayici' },
  { id: 't4', name: 'Cacık', calories: 82, isVegetarian: true, category: 'tamamlayici' },

  { id: 't5', name: 'Haydari', calories: 96, isVegetarian: true, category: 'tamamlayici' },
  { id: 't6', name: 'Tarator', calories: 180, isVegetarian: true, category: 'tamamlayici' },
  { id: 't7', name: 'Havuç Tarator', calories: 160, isVegetarian: true, category: 'tamamlayici' },

  { id: 't8', name: 'Mevsim Salata', calories: 46, isVegetarian: true, category: 'tamamlayici' },
  { id: 't9', name: 'Çoban Salata', calories: 70, isVegetarian: true, category: 'tamamlayici' },
  { id: 't10', name: 'Akdeniz Salata', calories: 67, isVegetarian: true, category: 'tamamlayici' },
  { id: 't11', name: 'Gavurdağı Salatası', calories: 120, isVegetarian: true, category: 'tamamlayici' },
  { id: 't12', name: 'Semizotu Salatası', calories: 85, isVegetarian: true, category: 'tamamlayici' },
  { id: 't13', name: 'Yoğurtlu Semizotu', calories: 110, isVegetarian: true, category: 'tamamlayici' },
  { id: 't14', name: 'Mor Lahana Salatası', calories: 80, isVegetarian: true, category: 'tamamlayici' },
  { id: 't15', name: 'Yoğurtlu Havuç Salatası', calories: 150, isVegetarian: true, category: 'tamamlayici' },

  { id: 't16', name: 'Turşu', calories: 57, isVegetarian: true, category: 'tamamlayici' },


  // =========================================================
  // TAMAMLAYICILAR - MEYVELER
  // =========================================================

  { id: 't17', name: 'Elma', calories: 95, isVegetarian: true, category: 'tamamlayici' },
  { id: 't18', name: 'Portakal', calories: 70, isVegetarian: true, category: 'tamamlayici' },
  { id: 't19', name: 'Mandalina', calories: 50, isVegetarian: true, category: 'tamamlayici' },
  { id: 't20', name: 'Muz', calories: 105, isVegetarian: true, category: 'tamamlayici' },
  { id: 't21', name: 'Kavun', calories: 42, isVegetarian: true, category: 'tamamlayici' },
  { id: 't22', name: 'Karpuz', calories: 90, isVegetarian: true, category: 'tamamlayici' },
  { id: 't23', name: 'Üzüm', calories: 100, isVegetarian: true, category: 'tamamlayici' },
  { id: 't24', name: 'Armut', calories: 100, isVegetarian: true, category: 'tamamlayici' },
  { id: 't25', name: 'Şeftali', calories: 60, isVegetarian: true, category: 'tamamlayici' },
  { id: 't26', name: 'Kayısı', calories: 50, isVegetarian: true, category: 'tamamlayici' },


  // =========================================================
  // TAMAMLAYICILAR - SÜTLÜ TATLILAR
  // =========================================================

  { id: 't27', name: 'Sütlaç', calories: 220, isVegetarian: true, category: 'tamamlayici' },
  { id: 't28', name: 'Kazandibi', calories: 240, isVegetarian: true, category: 'tamamlayici' },
  { id: 't29', name: 'Muhallebi', calories: 180, isVegetarian: true, category: 'tamamlayici' },
  { id: 't30', name: 'Keşkül', calories: 210, isVegetarian: true, category: 'tamamlayici' },
  { id: 't31', name: 'Puding', calories: 120, isVegetarian: true, category: 'tamamlayici' },

  { id: 't32', name: 'Trileçe', calories: 195, isVegetarian: true, category: 'tamamlayici' },
  { id: 't33', name: 'Tiramisu', calories: 382, isVegetarian: true, category: 'tamamlayici' },
  { id: 't34', name: 'Ekler', calories: 239, isVegetarian: true, category: 'tamamlayici' },
  { id: 't35', name: 'Brownie', calories: 382, isVegetarian: true, category: 'tamamlayici' },


  // =========================================================
  // TAMAMLAYICILAR - ŞERBETLİ / GELENEKSEL TATLILAR
  // =========================================================

  { id: 't36', name: 'Baklava', calories: 430, isVegetarian: true, category: 'tamamlayici' },
  { id: 't37', name: 'Şekerpare', calories: 300, isVegetarian: true, category: 'tamamlayici' },
  { id: 't38', name: 'Revani', calories: 320, isVegetarian: true, category: 'tamamlayici' },
  { id: 't39', name: 'Haşhaşlı Revani', calories: 253, isVegetarian: true, category: 'tamamlayici' },
  { id: 't40', name: 'Kalburabastı', calories: 440, isVegetarian: true, category: 'tamamlayici' },
  { id: 't41', name: 'Tulumba Tatlısı', calories: 360, isVegetarian: true, category: 'tamamlayici' },
  { id: 't42', name: 'Kemalpaşa Tatlısı', calories: 330, isVegetarian: true, category: 'tamamlayici' },

  { id: 't43', name: 'İrmik Helvası', calories: 320, isVegetarian: true, category: 'tamamlayici' },
  { id: 't44', name: 'Un Helvası', calories: 350, isVegetarian: true, category: 'tamamlayici' },
];
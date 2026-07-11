const fs = require('fs');
let content = fs.readFileSync('src/components/Collection.tsx', 'utf8');

const targetStr = `                    <AnimatePresence mode="wait">
                <div className="mt-32 pt-20 border-t border-vintage/15">`;

const replaceStr = `                    <AnimatePresence mode="wait">
                      {currentSaree && (
                        <motion.div
                          key={currentSaree.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-cream/95 backdrop-blur-md px-5 py-1.5 rounded-full shadow-md border border-vintage/20 pointer-events-auto flex items-center"
                        >
                          <span className="text-[9px] tracking-[0.2em] text-vintage uppercase font-bold">
                            {currentSaree.name}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button 
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full bg-cream/90 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white border border-vintage/20 transition-all duration-300 shadow-lg pointer-events-auto"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-cream/50 rounded-t-full">
                  <span className="font-display tracking-[0.25em] text-vintage/60 uppercase text-xs mb-4">
                    NO ARCHIVE RECORD
                  </span>
                  <p className="text-vintage/80 font-light text-sm leading-relaxed max-w-xs">
                    Please refresh or adjust your curated fabric search to locate these rare hand-woven textiles.
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMaterial(null);
                      setSelectedOccasion(null);
                    }}
                    className="mt-8 px-8 py-2.5 border border-vintage/30 text-vintage hover:bg-vintage hover:text-white transition-all duration-300 tracking-widest uppercase text-[10px] font-bold"
                  >
                    Reset Curations
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {currentSaree && (
        <SareeDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          saree={currentSaree} 
          fabricComponent={<OnamSareeFabric2D saree={currentSaree} />} 
        />
      )}
    </section>
  );
}`;

const startIndex = content.indexOf(targetStr);
if (startIndex !== -1) {
  content = content.substring(0, startIndex) + replaceStr;
  fs.writeFileSync('src/components/Collection.tsx', content);
  console.log("Collection.tsx fixed");
} else {
  console.log("Could not find the broken part");
}

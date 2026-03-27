import re

with open('helios-ui/src/components/ClientPortal.tsx', 'r') as f:
    content = f.read()

# Fix Payment Action when there's no selected plan.
# If there's no plan, we should redirect back to select one!
# We can do this by showing a button that says "Select a Plan" which triggers `onBack` or just let `onBack` be "Select Plan" if no plan selected.

replacement = """            ) : (
              <div className="text-gray-500 font-medium text-center py-12 flex flex-col items-center">
                <div className="mb-4">No plan selected.</div>
                <button
                  onClick={onBack}
                  className="px-6 py-2 border border-white/20 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  {language === 'bg' ? 'Избери План' : 'Select Plan'}
                </button>
              </div>
            )}"""

content = content.replace("""            ) : (
              <div className="text-gray-500 font-medium text-center py-12">No plan selected.</div>
            )}""", replacement)

with open('helios-ui/src/components/ClientPortal.tsx', 'w') as f:
    f.write(content)

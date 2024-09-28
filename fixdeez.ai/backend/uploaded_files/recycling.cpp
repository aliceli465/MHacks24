/* Author: Nathan Hu
It is ok to share my code anonymously for educational purposes */

#include <cmath>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

int main()
{
    ll n;
    cin >> n;
    vector<ll> estimates(n);
    for (ll i = 0; i < n; i++) {
        cin >> estimates[i];
    }
    vector<ll> m_stack; //monotonic stack
    vector<ll> left_smallest_indices(n);
    vector<ll> right_smallest_indices(n);
	
	//get closest left smaller indices for each index of the estimates, with monotonic stack (strictly increasing)
    for (ll i = 0; i < n; i++) {
        while (m_stack.size() > 0 && estimates[m_stack[m_stack.size()-1]] >= estimates[i]) {
            m_stack.pop_back(); //keep popping until the new item is greater 
        }
        left_smallest_indices[i] = m_stack.size() ? m_stack[m_stack.size() - 1] : -1; 
        m_stack.push_back(i);
    }
    m_stack.clear();
	//get closest right smaller indices with a new monotonic stack
    for (ll i = n-1; i >= 0; i--) {
        while (m_stack.size() > 0 && estimates[m_stack[m_stack.size()-1]] >= estimates[i]) {
            m_stack.pop_back();
        }
        right_smallest_indices[i] = m_stack.size() ? m_stack[m_stack.size() - 1] : estimates.size();
        m_stack.push_back(i);
    }

    ll max_area = estimates[0];
	//set s and e as large as possible, to be reduced later
    ll s = estimates.size();
    ll e = estimates.size();
    for (ll i = 0; i < n; i++) {
        ll new_area = (right_smallest_indices[i] - left_smallest_indices[i] - 1) * estimates[i]; //get area, not including the two indices
        if (max_area < new_area || (max_area == new_area && left_smallest_indices[i] + 2 < s)) { //property of max + tiebreaker
            max_area = new_area; //update max area
            s = left_smallest_indices[i] + 2; //bins are 1-indexed, add 2 to get first index that counts in the "area"
            e = right_smallest_indices[i]; //Do nothing, as bins are 1-indexed. This is the last index that counts
        }
    }

    cout << s << " " << e << " " << max_area;
    return 0;
}
